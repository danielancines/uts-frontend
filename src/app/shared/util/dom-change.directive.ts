import { Directive, OnDestroy, Output, EventEmitter, ElementRef } from '@angular/core';

@Directive({
    selector: '[domChange]'
  })
  export class DomChangeDirective implements OnDestroy {
    private changes: MutationObserver;
  
    @Output()
    public domChange = new EventEmitter();
  
    constructor(private elementRef: ElementRef) {
      const element = this.elementRef.nativeElement;
      console.log(element);
      this.changes = new MutationObserver((mutations: MutationRecord[]) => {
          mutations.forEach((mutation: MutationRecord) => this.domChange.emit(mutation));
        }
      );
  
      this.changes.observe(element, {
        childList: true
      });
    }
  
    ngOnDestroy(): void {
      this.changes.disconnect();
    }
}