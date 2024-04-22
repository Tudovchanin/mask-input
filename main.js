

const phoneNumberMask = (positionStart, mask, numberPlaceholder, selector, hover = false) => {
	const input = document.querySelector(selector);
	const lengthMask = mask.length;
	let valueArrMask = mask.split('');
	let valueUser = '';
	let indexValue = positionStart;
	let cursorPosition = positionStart;
	let inputFocus = false;


	input.addEventListener('focus', (e) => {
		inputFocus = true;
		if (!valueUser.length) {
			e.target.value = mask;
			setCursorPosition(input, positionStart)
		}
	})
	input.addEventListener('blur', (e) => {
		inputFocus = false;
		if (!valueUser.length) {
			e.target.value = '';
		}
	})
	input.addEventListener('keydown', (e) => {
		e.preventDefault()
		const key = e.key;
		if (key === 'Tab') return;
		if (key === 'Delete' && cursorPosition < indexValue) {
			if (cursorPosition < positionStart) {
				cursorPosition = positionStart;
				setCursorPosition(e.target, cursorPosition);
				return;
			}
			if (valueArrMask[indexValue - 1] === ')' || valueArrMask[indexValue - 1] === '(' || valueArrMask[indexValue - 1] === '-' || valueArrMask[indexValue - 1] === ' ') {
				indexValue = decrementIndexValue(indexValue);
			}

			indexValue = decrementIndexValue(indexValue);
			valueArrMask = deleteNumberPhone(valueArrMask, indexValue, numberPlaceholder);
			valueUser = deleteLastCharacter(valueUser);
			e.target.value = valueArrMask.join('');
			setCursorPosition(e.target, cursorPosition);
			return;
		}



		if (key === 'ArrowRight') {
			cursorPosition < lengthMask && cursorPosition++;
			setCursorPosition(e.target, cursorPosition);
		} if (key === 'ArrowLeft') {
			cursorPosition > 0 && cursorPosition--;
			setCursorPosition(e.target, cursorPosition);
		}

		if (key === 'Backspace' && indexValue > positionStart) {

			if (valueArrMask[indexValue - 1] === ')' || valueArrMask[indexValue - 1] === '(' || valueArrMask[indexValue - 1] === '-' || valueArrMask[indexValue - 1] === ' ') {
				indexValue = decrementIndexValue(indexValue);
				indexValue = decrementIndexValue(indexValue);
				valueArrMask = backspaceNumberPhone(valueArrMask, indexValue, numberPlaceholder);
				cursorPosition = indexValue;
				setCursorPosition(e.target, cursorPosition);
				valueUser = deleteLastCharacter(valueUser);
				return;
			}
			indexValue = decrementIndexValue(indexValue);
			cursorPosition = indexValue;
			valueArrMask = backspaceNumberPhone(valueArrMask, indexValue, numberPlaceholder);
			valueUser = deleteLastCharacter(valueUser, numberPlaceholder);
			e.target.value = valueArrMask.join('');
			setCursorPosition(e.target, cursorPosition);
			return;
		}

		if (indexValue === lengthMask) {
			return;
		}
		if (e.code === 'Backspace' && e.target.selectionStart < positionStart) {
			e.preventDefault();
			setCursorPosition(e.target, positionStart)
		}
		if (key >= '0' && key <= '9') {
			if (valueArrMask[indexValue] === ')' || valueArrMask[indexValue] === '(' || valueArrMask[indexValue] === '-' || valueArrMask[indexValue] === ' ') {
				indexValue = incrementIndex(indexValue);
			}
			valueUser += e.key;
			valueArrMask[indexValue] = e.key;
			indexValue = incrementIndex(indexValue);
			cursorPosition = indexValue;
			e.target.value = valueArrMask.join('');
			setCursorPosition(e.target, cursorPosition);
		}
	});

	input.addEventListener('click', (e) => {
		if (e.target.selectionStart < positionStart || !valueUser) {
			setCursorPosition(e.target, positionStart);
			cursorPosition = e.target.selectionStart;
			return
		}
		cursorPosition = e.target.selectionStart;
	})


	if (hover) {
		input.addEventListener('mouseenter', (e) => {
			if (!valueUser.length) {
				e.target.value = mask;
			}
		});
		input.addEventListener('mouseleave', (e) => {
			if (!valueUser.length && !inputFocus) {
				e.target.value = '';
			}
		});
	}

	function backspaceNumberPhone(arr, cursorPosition, numberPlaceholder) {
		let maskArr = arr;
		let arrUserData = maskArr.map((v, i, arr) => {
			if (i === cursorPosition) {
				arr[i] = numberPlaceholder;
				return arr[i];
			}
			return v;
		})
		return arrUserData;
	}
	function deleteNumberPhone(arr, cursorPosition, numberPlaceholder) {
		let maskArr = arr;
		let arrUserData = maskArr.map((v, i, arr) => {
			if (i >= cursorPosition && arr[i] !== '-' && arr[i] !== ')' && arr[i] !== '(' && arr[i] !== ' ') {
				return arr[i] = numberPlaceholder;
			}
			return v;
		})
		return arrUserData;
	}
	function setCursorPosition(inputElement, cursorPosition) {
		inputElement.selectionStart = inputElement.selectionEnd = cursorPosition;
	}
	function decrementIndexValue(index) {
		return index - 1;
	}
	function incrementIndex(index) {
		return index + 1;
	}
	function deleteLastCharacter(str) {
		return str.slice(0, -1);
	}
}
phoneNumberMask(3, '+7(___)___-__-__', '_', '.mask', true);//phoneNumberMask(стартовая позиция курсора, маска, заменяемый символ в маске, класс input к которому применяется маска,булево значение эффекта hover маски)