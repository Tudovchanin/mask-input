class InputMask {
  inputFocus = false;
  arrValueInputAndMask = "";
  cursorPosition = 0;
  constructor(startPosition, maskString, symbolsArrNotReplace, elem) {
    this.positionStart = startPosition;
    this.mask = maskString;
    this.arrNotReplaceSymbols = symbolsArrNotReplace;
    this.input = elem;
  }

  initMask() {
    this.cursorPosition = this.positionStart;
    this.arrValueInputAndMask = this.mask.split("");
    this.input.addEventListener("focus", this.handleFocus);
    this.input.addEventListener("blur", this.handleBlur);
    this.input.addEventListener("input", this.handleInput);
    this.input.addEventListener("click", this.handleClick);
  }

  handleFocus = () => {
    this.inputFocus = true;
    if (!this.input.value) {
      this.input.value = this.mask;
      this.setCursorPosition(this.positionStart);
      return;
    }
    this.setCursorPosition(this.cursorPosition);
  };
  handleBlur = () => {
    this.inputFocus = false;
    if (this.input.value === this.mask) {
      this.input.value = "";
    }
  };

  handleClick = () => {
    if (this.input.value === this.mask) {
      this.setCursorPosition(this.positionStart);
      return;
    }
    this.setCursorPosition(
      Math.max(this.positionStart, this.input.selectionEnd)
    );
  };

  handleInput = (e) => {
    const typeInput = e.inputType;

    // удаление значений input
    if (
      typeInput === "deleteContentBackward" ||
      typeInput === "deleteContentForward"
    ) {
      
      this.cursorPosition = this.input.selectionEnd;

      // логика пропуска не заменяемых символов маски
      if (
        this.arrNotReplaceSymbols.includes(
          this.arrValueInputAndMask[this.cursorPosition]
        ) ||
        this.arrValueInputAndMask[this.cursorPosition] === " "
      ) {
        if (typeInput !== "deleteContentForward") {
          this.cursorPosition--;
        }
      }

      // логика возврата курсора, если ушел за positionStart
      if (this.cursorPosition < this.positionStart) {
        this.updateInputValue();
        this.setCursorPosition(this.positionStart);
        return;
      }

      // замена символов маски
      this.arrValueInputAndMask[this.cursorPosition] =
        this.mask[this.cursorPosition];
      this.updateInputValue();
      this.setCursorPosition(this.cursorPosition);
      return;
    }

    // ОСТАНОВКА ЗАПОЛНЕНИЯ МАСКИ-
    if (this.input.selectionEnd > this.arrValueInputAndMask.length) {
      this.updateInputValue();
      return;
    }

    const inputValue = e.data ? +e.data : "не число";

    // логика возврата курсора при вводе до positionStart
    if (this.input.selectionEnd - 1 < this.positionStart) {
      this.updateInputValue();
      this.setCursorPosition(this.positionStart);
      return;
    }

    // ПРОВЕРКА НА ЧИСЛО
    if (isNaN(inputValue)) {
      this.updateInputValue();
      this.setCursorPosition(Math.max(this.positionStart, this.cursorPosition));
      return;
    }

    //  ВВОД ЧИСЕЛ

    if (inputValue >= 0 && inputValue <= 9) {
      this.cursorPosition = this.input.selectionEnd;
      this.replaceMaskSymbolOnInput(inputValue);
    }
  };
  updateInputValue() {
    this.input.value = this.arrValueInputAndMask.join("");
  }

  setCursorPosition = (position) => {
    this.input.selectionStart = position;
    this.input.selectionEnd = position;
  };

  replaceMaskSymbolOnInput(value) {
    // если курсор перепрыгивает символ
    if (
      this.arrNotReplaceSymbols.includes(
        this.arrValueInputAndMask[this.cursorPosition - 1]
      ) ||
      this.arrValueInputAndMask[this.cursorPosition - 1] === " "
    ) {
      this.arrValueInputAndMask[this.cursorPosition] = value;
      this.updateInputValue();
      this.cursorPosition++;
      this.setCursorPosition(this.cursorPosition);
    } else {
      // если курсор не перепрыгивает символ
      this.arrValueInputAndMask[this.cursorPosition - 1] = value;
      this.updateInputValue();
      this.setCursorPosition(this.cursorPosition);
    }
  }

  removeMaskListeners() {
    this.input.removeEventListener("focus", this.handleFocus);
    this.input.removeEventListener("blur", this.handleBlur);
    this.input.removeEventListener("input", this.handleInput);
    this.input.removeEventListener("click", this.handleClick);
  }
}

const maskStart = 3;
const maskValue = "+7(___)___-__-__";
const maskSymbolsNotReplace = [")", "(", "-"];
const input = document.getElementById("mask-tel");
const bg = document.getElementById("bg");

const mask = new InputMask(maskStart, maskValue, maskSymbolsNotReplace, input);
mask.initMask();

document.addEventListener("click", () => {
  if (mask.inputFocus) {
    bg.classList.add("bg-change");
  } else {
    bg.classList.remove("bg-change");
  }
});
