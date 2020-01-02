import { ComponentFixture, TestBed, fakeAsync, flush } from "@angular/core/testing";
import { CategoriesComponent } from "./categories.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule, MatTableModule } from "@angular/material";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CategoriesService } from "./categories.service";
import { RolesValidatorService } from "app/auth/roles-validator.service";
import { MessageService } from "app/shared/message.service";
import { ErrorsHandlerService } from "app/errors/errors-handler.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe('CategoriesComponent', () => {
    let fixture: ComponentFixture<CategoriesComponent>;
    let mockCategoriesService,
        mockRolesValidatorService,
        mockMessageService,
        mockErrorsHandlerService,
        mockTranslateService,
        mockDataSource;

    beforeEach(() => {
        mockCategoriesService = jasmine.createSpyObj(['add']);
        mockRolesValidatorService = jasmine.createSpyObj(['validate']);
        mockMessageService = jasmine.createSpyObj(['showMessage']);
        mockErrorsHandlerService = jasmine.createSpyObj(['handleError']);
        mockTranslateService = jasmine.createSpyObj(['get']);
        mockDataSource = jasmine.createSpyObj(['refresh']);

        TestBed.configureTestingModule({
            imports: [
                MatDialogModule,
                TranslateModule,
                MatTableModule
            ],
            declarations: [
                CategoriesComponent
            ],
            providers: [
                { provide: CategoriesService, useValue: mockCategoriesService },
                { provide: RolesValidatorService, useValue: mockRolesValidatorService },
                { provide: MessageService, useValue: mockMessageService },
                { provide: ErrorsHandlerService, useValue: mockErrorsHandlerService },
                { provide: TranslateService, useValue: mockTranslateService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(CategoriesComponent);
    });

    it('shoud on refresh the searchTerm property must be empty', fakeAsync(() => {
        fixture.componentInstance.dataSource = mockDataSource;
        fixture.componentInstance.searchTerm = 'search for';
        //fixture.componentInstance.ngAfterViewInit();
        flush();

        fixture.componentInstance.refresh();

        expect(fixture.componentInstance.searchTerm).toBe('');
    }));
});