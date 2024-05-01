import { AbstractControl } from '@angular/forms';

export function ValidateReview(control: AbstractControl) {
  // check if there are emojis  
  const regex = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/u;
  
  if (regex.test(control.value)) {
    return { invalidInput: true };
  }
  return null;
}