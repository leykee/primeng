import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, NgModule, Output, QueryList, TemplateRef, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { CheckIcon } from 'primeng/icons/check';
import { TimesIcon } from 'primeng/icons/times';
import { Nullable } from 'primeng/ts-helpers';
import { TriStateCheckboxChangeEvent } from './tristatecheckbox.interface';

export const TRISTATECHECKBOX_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TriStateCheckbox),
    multi: true
};
/**
 * TriStateCheckbox is used to select either 'true', 'false' or 'null' as the value.
 * @group Components
 */
@Component({
    selector: 'p-triStateCheckbox',
    template: `
        <div
            [ngStyle]="style"
            [ngClass]="{ 'p-checkbox p-component': true, 'p-checkbox-disabled': disabled, 'p-checkbox-focused': focused }"
            [class]="styleClass"
            (click)="onClick($event, input)"
            [attr.data-pc-name]="'tristatecheckbox'"
            [attr.data-pc-section]="'root'"
        >
            <div class="p-hidden-accessible" [attr.data-pc-section]="'hiddenInputWrapper'">
                <input
                    #input
                    [attr.id]="inputId"
                    type="checkbox"
                    [name]="name"
                    [attr.tabindex]="tabindex"
                    [readonly]="readonly"
                    [disabled]="disabled"
                    (keydown)="onKeyDown($event)"
                    (focus)="onFocus()"
                    (blur)="onBlur()"
                    [attr.aria-labelledby]="ariaLabelledBy"
                    [attr.aria-label]="ariaLabel"
                    inputmode="none"
                    [attr.data-pc-section]="'hiddenInput'"
                />
            </div>
            <div class="p-checkbox-box" role="checkbox" [attr.aria-checked]="value === true" [ngClass]="{ 'p-highlight': value != null, 'p-disabled': disabled, 'p-focus': focused }">
                <ng-container *ngIf="value === true">
                    <span *ngIf="checkboxTrueIcon" [ngClass]="checkboxTrueIcon" class="p-checkbox-icon" [attr.data-pc-section]="'checkIcon'"></span>
                    <ng-container *ngIf="!checkboxTrueIcon">
                        <CheckIcon [styleClass]="'p-checkbox-icon'" *ngIf="!checkIconTemplate" [attr.data-pc-section]="'checkIcon'" />
                        <span *ngIf="checkIconTemplate" class="p-checkbox-icon" [attr.data-pc-section]="'checkIcon'">
                            <ng-template *ngTemplateOutlet="checkIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </ng-container>
                <ng-container *ngIf="value === false">
                    <span *ngIf="checkboxFalseIcon" [ngClass]="checkboxFalseIcon" class="p-checkbox-icon" [attr.data-pc-section]="'uncheckIcon'"></span>
                    <ng-container *ngIf="!checkboxFalseIcon">
                        <TimesIcon [styleClass]="'p-checkbox-icon'" *ngIf="!uncheckIconTemplate" [attr.data-pc-section]="'uncheckIcon'" />
                        <span class="p-checkbox-icon" *ngIf="uncheckIconTemplate" [attr.data-pc-section]="'uncheckIcon'">
                            <ng-template *ngTemplateOutlet="uncheckIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </ng-container>
            </div>
        </div>
        <label class="p-checkbox-label" (click)="onClick($event, input)" [ngClass]="{ 'p-checkbox-label-active': value != null, 'p-disabled': disabled, 'p-checkbox-label-focus': focused }" *ngIf="label" [attr.for]="inputId">{{ label }}</label>
    `,
    providers: [TRISTATECHECKBOX_VALUE_ACCESSOR],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'p-element'
    }
})
export class TriStateCheckbox implements ControlValueAccessor {
    constructor(private cd: ChangeDetectorRef) {}
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    @Input() disabled: boolean | undefined;
    /**
     * Name of the component.
     * @group Props
     */
    @Input() name: string | undefined;
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    @Input() ariaLabel: string | undefined;
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    @Input() ariaLabelledBy: string | undefined;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    @Input() tabindex: number | undefined;
    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    @Input() inputId: string | undefined;
    /**
     * Inline style of the component.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Style class of the component.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * Label of the checkbox.
     * @group Props
     */
    @Input() label: string | undefined;
    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    @Input() readonly: boolean | undefined;
    /**
     * Specifies the icon for checkbox true value.
     * @group Props
     */
    @Input() checkboxTrueIcon: string | undefined;
    /**
     * Specifies the icon for checkbox false value.
     * @group Props
     */
    @Input() checkboxFalseIcon: string | undefined;
    /**
     * Callback to invoke on value change.
     * @param {TriStateCheckboxChangeEvent} event - Custom change event.
     * @group Emits
     */
    @Output() onChange: EventEmitter<TriStateCheckboxChangeEvent> = new EventEmitter<TriStateCheckboxChangeEvent>();

    @ContentChildren(PrimeTemplate) templates!: QueryList<PrimeTemplate>;

    checkIconTemplate: Nullable<TemplateRef<any>>;

    uncheckIconTemplate: Nullable<TemplateRef<any>>;

    focused: Nullable<boolean>;

    value: Nullable<boolean>;

    onModelChange: Function = () => {};

    onModelTouched: Function = () => {};

    onClick(event: Event, input: HTMLInputElement) {
        if (!this.disabled && !this.readonly) {
            this.toggle(event);
            this.focused = true;
            input.focus();
        }
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.toggle(event);
            event.preventDefault();
        }
    }

    toggle(event: Event) {
        if (this.value == null || this.value == undefined) this.value = true;
        else if (this.value == true) this.value = false;
        else if (this.value == false) this.value = null;

        this.onModelChange(this.value);
        this.onChange.emit({
            originalEvent: event,
            value: this.value
        });
    }

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'checkicon':
                    this.checkIconTemplate = item.template;
                    break;

                case 'uncheckicon':
                    this.uncheckIconTemplate = item.template;
                    break;
            }
        });
    }

    onFocus() {
        this.focused = true;
    }

    onBlur() {
        this.focused = false;
        this.onModelTouched();
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    writeValue(value: any): void {
        this.value = value;
        this.cd.markForCheck();
    }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
        this.cd.markForCheck();
    }
}

@NgModule({
    imports: [CommonModule, SharedModule, CheckIcon, TimesIcon],
    exports: [TriStateCheckbox, SharedModule],
    declarations: [TriStateCheckbox]
})
export class TriStateCheckboxModule {}
