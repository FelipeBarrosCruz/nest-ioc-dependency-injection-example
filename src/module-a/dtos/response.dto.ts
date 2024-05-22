export class ResponseDTO {
  public status: string;
  public context: string;

  constructor(args: ResponseDTO) {
    Object.assign(this, args);
  }
}
