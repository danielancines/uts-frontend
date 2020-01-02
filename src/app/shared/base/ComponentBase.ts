import { FormGroup } from "@angular/forms";

export class ComponentBase {
    validateForm(formGroup: FormGroup): boolean {
        if (!formGroup.invalid) return true;

        Object.keys(formGroup.controls).forEach((key: string) => {
            const control = formGroup.get(key);
            if (control.invalid) {
                control.markAsTouched();
            }
        });

        return false;
    }
}