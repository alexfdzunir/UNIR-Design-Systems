// url=<PRIMEONE>?node-id=12273-14312
// source=https://github.com/alexfdzunir/UNIR-Design-Systems/blob/main/src/components/Question/question.ts
// component=PrimeOneQuestion
import figma from 'figma'
import { attr, firstText, is, jsText } from '../../figma/helpers'

const instance = figma.selectedInstance
const type = instance.getEnum('Type', { 'Multiple choice': 'multiple', 'Single choice': 'single', 'Free text': 'text', Editing: 'multiple' })
const state = instance.getEnum('State', {
  Default: undefined, Edit: undefined, 'Radio Buttons': undefined, Check: undefined, 'Free text': undefined,
  Success: 'success', Error: 'error', Unanswered: 'unanswered', Corrected: 'corrected',
})
const statement = firstText(instance) ?? 'Enunciado de la pregunta'
const options = type === 'text' ? '' : ' [options]="options"'

const example = figma.code`<prime-one-question [number]="1" statement="${jsText(statement)}"${type === 'multiple' ? '' : ` type="${type}"`}${options} [(answer)]="answer"${attr('state', state)}${state ? ' feedback="Explicación de la corrección"' : ''}${is(instance, 'Role', 'Teacher') ? ' role="teacher"' : ''}${is(instance, 'Size', 'Mobile') ? ' [mobile]="true"' : ''} />`
const imports = ["import { PrimeOneQuestion } from 'prime-one-ds';"]

export default {
  example,
  imports,
  id: 'question',
  metadata: { nestable: true },
}
