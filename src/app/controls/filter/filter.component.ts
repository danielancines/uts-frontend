import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IFilterGroup } from './model/group.model';
import { IFilterOption } from './model/option.model';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() groups: IFilterGroup[] = [];
  @Input() noFiltersTextTranslationKey: string;
  @Input() filterTitleTranslationKey: string;

  private _selectedFilterOptions: IFilterOption[];
  @Input()
  set selectedFilterOptions(options: IFilterOption[]){
    this._selectedFilterOptions = options;
    this.intializeSelectedOptions();
  }
  get selectedFilterOptions(): IFilterOption[] {
    return this._selectedFilterOptions;
  }

  @Output() selectedFilterOptionsChanged: EventEmitter<IFilterOption[]> = new EventEmitter();
  noFiltersText: string = 'No filters are available';
  filterTitle: string = 'Filter';
  public selectedOptions: IFilterOption[] = [];

  constructor(private _translateService: TranslateService) {

  }

  ngOnInit() {
    this.translate();
    _.forEach(this.groups, g=> _.forEach(g.options, o => {
      if (o.isSelected){
        this.selectedOptions.push(o);
      }
    }));

    this._translateService.onLangChange
    .subscribe(() => {
      this.translate();
    });
  }

  onOptionSelected(option: IFilterOption){
    option.isSelected = !option.isSelected;

    if (!option.isSelected && _.includes(this.selectedOptions, option)){
      _.remove(this.selectedOptions, option);
    } else {
      this.selectedOptions.push(option);
    }

    this.selectedFilterOptionsChanged.emit(this.selectedOptions);
  }

  private translate(){
    if (this._translateService) {
      if (this.noFiltersTextTranslationKey) this.translateNoFiltersText();
      if (this.filterTitleTranslationKey) this.translateFilterTitle();
    }
  }

  private translateNoFiltersText() {
    this._translateService.get(this.noFiltersTextTranslationKey)
      .subscribe(translation => {
        this.noFiltersText = translation;
      });
  }

  private translateFilterTitle() {
    this._translateService.get(this.filterTitleTranslationKey)
      .subscribe(translation => {
        this.filterTitle = translation;
      });
  }

  private intializeSelectedOptions(){
    _.forEach(this.selectedFilterOptions, o => {
      _.forEach(this.groups, o => _.forEach(o.options, o => {
        let option = _.find(this.selectedFilterOptions, {'name': o.name});
        if (option){
          o.isSelected = true;
        }
      }));
    });
  }
}
