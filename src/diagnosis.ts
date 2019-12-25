export class Position {
  line: number
  col: number
  constructor(line:number,col:number) {
    this.line=line
    this.col=col
  }
}
export class ErrorReport {
  message: string
  pos: Position
  constructor(message: string, pos: Position) {
    this.message = message
    this.pos = pos
  }
}
export default class Diagnosis {
  errors: ErrorReport[]
  addError(error: ErrorReport) {
    this.errors.push(error)
  }
}