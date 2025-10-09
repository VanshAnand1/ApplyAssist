export class Keyword {
  text: string = '';
  done: boolean = false;
  id: string = Date.now().toString();

  updateKeywordName(name: string) {
    this.text = name;
  }

  toggleKeywordStatus() {
    this.done = !this.done;
  }
}
