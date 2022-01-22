

export class Opt {
  value:any = null;
  constructor(v:any){
    this.value = v;
  }

  isPresent():boolean {
    return this.value != null && this.value != undefined
  }

  get():any {
    return (this.isPresent())? this.value: null;
  }

}
