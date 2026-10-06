// Barrido de tokens por componente (solo lectura) para use_figma.
// Rellenar IDS con los ids de las páginas a revisar (un grupo de páginas por llamada, en paralelo).
// Para cada component set o componente suelto revisa sus propias capas (no entra en instancias de otros componentes):
//   - referencias a variables que ya no existen (rotas) y alias que no resuelven en algún modo
//   - qué tipo de token usa: de componente o custom que corresponde al componente, de otro componente,
//     semántico, primitivo o de otra colección
//   - valores fijos sin token: colores, números (gap, padding, radio, borde), texto sin estilo ni variables y efectos
// Devuelve solo los componentes con algún problema y los totales del grupo.
const IDS = [];
// Tipo de token según el nombre de la colección (PrimeOne: Primitive, typography, Semantic/*, App, Component/*, Custom;
// AEM: core, semantic, responsive size). Ajustar si el sistema usa otros nombres.
const KIND = name => /^(primitive|core|typography)/i.test(name) ? 'primitive' : /^(semantic|app|responsive)/i.test(name) ? 'semantic' : /^(component|custom)/i.test(name) ? 'component' : 'other';
// Mínimo de referencias que deben ser tokens del propio componente para darlo por limpio
const MIN_OWN = 0.9;
const NUM_FIELDS = ['itemSpacing', 'counterAxisSpacing', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'];
const STROKE_FIELDS = ['strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight'];

const vars = new Map(), cols = new Map(), aliasOk = new Map();
const getVar = async id => { if (!vars.has(id)) vars.set(id, await figma.variables.getVariableByIdAsync(id)); return vars.get(id); };
const getCol = async id => { if (!cols.has(id)) cols.set(id, await figma.variables.getVariableCollectionByIdAsync(id)); return cols.get(id); };
const colSets = new Map();
const inCol = (col, id) => { if (!colSets.has(col.id)) colSets.set(col.id, new Set(col.variableIds)); return colSets.get(col.id).has(id); };
const aliasesResolve = async v => {
  if (!aliasOk.has(v.id)) {
    let ok = true;
    for (const val of Object.values(v.valuesByMode)) {
      if (!val || val.type !== 'VARIABLE_ALIAS') continue;
      const t = await getVar(val.id);
      const tc = t && !t.remote ? await getCol(t.variableCollectionId) : null;
      if (!t || (!t.remote && (!tc || !inCol(tc, t.id)))) ok = false;
    }
    aliasOk.set(v.id, ok);
  }
  return aliasOk.get(v.id);
};
// Raíz del token: "Component/Color Scheme/button/primary/background" o "component common/button/gap" -> "button"
const PREFIX = /^(component|semantic|common|color scheme)( .+)?$/i;
const rootOf = name => {
  const seg = name.split('/');
  while (seg.length > 1 && PREFIX.test(seg[0])) seg.shift();
  return seg[0].toLowerCase().replace(/^proeduca-/, '');
};
const isOwn = (compName, varName) => {
  const stem = compName.toLowerCase().replace(/^_/, '');
  const root = rootOf(varName);
  return stem === root || stem.startsWith(root + '-') || stem.split(/[-/ ]/).includes(root);
};
const ids = b => (Array.isArray(b) ? b : [b]).map(x => x && x.id).filter(Boolean);
const sameIds = (a, b) => ids(a || []).join() === ids(b || []).join();
// Pinturas y efectos se cuentan en sus propios bucles; aquí solo el resto de campos
const PAINT_KEYS = ['fills', 'strokes', 'effects'];
const paintKey = ps => Array.isArray(ps) ? JSON.stringify(ps.map(p => [p.type, p.visible, p.color, p.boundVariables && p.boundVariables.color && p.boundVariables.color.id])) : 'mixed';
// Variables de librerías externas: externas aunque la colección se llame Core o semantic
const isExternal = (v, col) => v.remote || !col;
// Variables locales borradas que siguen enlazadas: la API las devuelve, pero ya no están en ninguna colección
const isDeleted = (v, col) => !v.remote && !!col && !inCol(col, v.id);
const ownNodes = comp => {
  const out = [];
  const walk = n => { out.push(n); if (n.type === 'INSTANCE') return; if ('children' in n) for (const c of n.children) walk(c); };
  for (const c of comp.type === 'COMPONENT_SET' ? comp.children : [comp]) walk(c);
  return out;
};

const report = [];
const total = { components: 0, clean: 0, broken: 0, brokenRefs: 0, refs: 0, own: 0, otherComp: 0, semantic: 0, primitive: 0, other: 0, hardColor: 0, hardNumber: 0, hardText: 0, hardEffect: 0 };
for (const pid of IDS) {
  const page = await figma.getNodeByIdAsync(pid);
  await page.loadAsync();
  const comps = [...page.findAllWithCriteria({ types: ['COMPONENT_SET'] }), ...page.findAllWithCriteria({ types: ['COMPONENT'] }).filter(c => c.parent.type !== 'COMPONENT_SET')];
  for (const comp of comps) {
    const r = { refs: 0, own: 0, otherComp: 0, semantic: 0, primitive: 0, other: 0, broken: 0, brokenAlias: 0, hardColor: 0, hardNumber: 0, hardText: 0, hardEffect: 0, samples: new Set() };
    const refs = [];
    for (const n of ownNodes(comp)) {
      // En la raíz de una instancia solo cuenta lo que el componente cambia (sus overrides); lo heredado es del componente
      // instanciado. El principal solo se consulta si hay override de variables, porque getMainComponentAsync es lento.
      const inst = n.type === 'INSTANCE';
      const ov = inst ? new Set(((n.overrides || []).find(o => o.id === n.id) || { overriddenFields: [] }).overriddenFields) : null;
      const needMain = inst && (ov.has('boundVariables') || Object.keys(n.boundVariables || {}).some(f => !PAINT_KEYS.includes(f) && ov.has(f)));
      const main = needMain ? await n.getMainComponentAsync() : null;
      const mb = (main && main.boundVariables) || {};
      for (const [f, b] of Object.entries(n.boundVariables || {})) {
        if (PAINT_KEYS.includes(f) || (inst && (!main || sameIds(b, mb[f])))) continue;
        refs.push(...ids(b));
      }
      for (const field of ['fills', 'strokes']) {
        if (!(field in n) || !Array.isArray(n[field])) continue;
        if (inst && !ov.has(field)) continue;
        if (main && paintKey(n[field]) === paintKey(main[field])) continue;
        if (field === 'strokes' && !n[field].length) continue;
        if (field === 'fills' && typeof n.fillStyleId === 'string' && n.fillStyleId) continue;
        if (field === 'strokes' && typeof n.strokeStyleId === 'string' && n.strokeStyleId) continue;
        for (const p of n[field]) {
          if (p.type !== 'SOLID' || p.visible === false || p.opacity === 0) continue;
          if (p.boundVariables && p.boundVariables.color) refs.push(p.boundVariables.color.id);
          else { r.hardColor++; r.samples.add(`color fijo en "${n.name}"`); }
        }
      }
      if (n.type === 'TEXT' && !(typeof n.textStyleId === 'string' && n.textStyleId)) {
        const tb = n.boundVariables || {};
        if (!tb.fontSize && !tb.fontFamily && !tb.lineHeight) { r.hardText++; r.samples.add(`texto sin estilo "${n.name}"`); }
      }
      if (n.type !== 'INSTANCE') {
        // Huecos y paddings solo cuentan con auto-layout; el hueco no cuenta con "space between" y el de filas solo con wrap
        const auto = 'layoutMode' in n && n.layoutMode !== 'NONE';
        const skip = f => (/padding|Spacing/.test(f) && !auto) || (f === 'itemSpacing' && n.primaryAxisAlignItems === 'SPACE_BETWEEN') || (f === 'counterAxisSpacing' && n.layoutWrap !== 'WRAP');
        for (const f of NUM_FIELDS) if (f in n && typeof n[f] === 'number' && n[f] > 0 && !skip(f) && !(n.boundVariables && n.boundVariables[f])) { r.hardNumber++; r.samples.add(`${f} fijo en "${n.name}"`); }
        if ('strokes' in n && Array.isArray(n.strokes) && n.strokes.length) for (const f of STROKE_FIELDS) if (f in n && n[f] > 0 && !(n.boundVariables && n.boundVariables[f])) { r.hardNumber++; break; }
      }
      if ('effects' in n && n.effects.length && !(typeof n.effectStyleId === 'string' && n.effectStyleId) && !(inst && !ov.has('effects'))) {
        for (const e of n.effects) { const eb = ids(Object.values(e.boundVariables || {})); if (eb.length) refs.push(...eb); else if (e.visible !== false) { r.hardEffect++; r.samples.add(`efecto fijo en "${n.name}"`); } }
      }
    }
    for (const id of refs) {
      r.refs++;
      const v = await getVar(id);
      if (!v) { r.broken++; r.samples.add(`referencia rota ${id}`); continue; }
      if (!(await aliasesResolve(v))) { r.brokenAlias++; r.samples.add(`alias roto en ${v.name}`); }
      const col = await getCol(v.variableCollectionId);
      if (isDeleted(v, col)) { r.broken++; r.samples.add(`variable borrada: ${v.name}`); continue; }
      const k = isExternal(v, col) ? 'other' : KIND(col.name);
      if (k === 'component') { if (isOwn(comp.name, v.name)) r.own++; else { r.otherComp++; r.samples.add(`token de otro componente: ${v.name}`); } }
      else { r[k]++; r.samples.add(`${k}: ${v.name}`); }
    }
    const clean = r.broken === 0 && r.brokenAlias === 0 && r.hardColor === 0 && (r.refs === 0 || r.own / r.refs >= MIN_OWN);
    total.components++; if (clean) total.clean++; if (r.broken || r.brokenAlias) total.broken++; total.brokenRefs += r.broken + r.brokenAlias;
    for (const k of ['refs', 'own', 'otherComp', 'semantic', 'primitive', 'other', 'hardColor', 'hardNumber', 'hardText', 'hardEffect']) total[k] += r[k];
    if (!clean) report.push([comp.id, comp.name, page.name.slice(0, 24), `${r.own}/${r.refs} propios`, `otros:${r.otherComp} sem:${r.semantic} prim:${r.primitive} ext:${r.other}`, `rotos:${r.broken + r.brokenAlias}`, `fijos color:${r.hardColor} num:${r.hardNumber} texto:${r.hardText} efecto:${r.hardEffect}`, [...r.samples].slice(0, 4).join(' | ')]);
  }
}
return { total, report };
