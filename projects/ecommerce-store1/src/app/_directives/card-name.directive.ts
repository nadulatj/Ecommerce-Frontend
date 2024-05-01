import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][cardNameInputMask]',
})
export class CardNameDirective {

    @HostListener('input', ['$event'])
    onKeyDown(event: KeyboardEvent): any {
        const input = event.target as HTMLInputElement;
        const pattern = /^[A-Za-z\s]+$/;
        
        if (!pattern.test(input.value)) {
     
            return (input.value ="");
          }

          if(input.value.length>30){
            return (input.value =input.value.substr(0, input.value.length-1));
          }


    }
}