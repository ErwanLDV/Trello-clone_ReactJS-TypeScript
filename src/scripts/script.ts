let actualContainer: HTMLDivElement,
    actualBtn: HTMLButtonElement,
    actualUL: HTMLUListElement,
    actualForm: HTMLFormElement,
    actualTextInput: HTMLInputElement,
    actualValidation: HTMLSpanElement;
    
    

export function handleAddItem(e: React.MouseEvent) {
  const btn = e.target as HTMLButtonElement;
  if(actualContainer) toggleForm(actualBtn, actualForm, false);
  setContainerItems(btn);
  toggleForm(actualBtn, actualForm, true)
}

export function toggleForm(btn: HTMLButtonElement, form: HTMLFormElement, action: Boolean) {
  if(!action) {
      form.style.display = "none";
      btn.style.display = "block";
  } else if (action) {
      form.style.display = "block";
      btn.style.display = "none";
  }
}

export function setContainerItems(btn: HTMLButtonElement) {
  actualBtn = btn;
  actualContainer = btn.parentElement as HTMLDivElement;
  actualUL = actualContainer.querySelector('ul') as HTMLUListElement;
  actualForm = actualContainer.querySelector('form') as HTMLFormElement;   
  actualTextInput = actualContainer.querySelector('input') as HTMLInputElement;   
  actualValidation = actualContainer.querySelector('.validation-msg') as HTMLSpanElement;   
}
