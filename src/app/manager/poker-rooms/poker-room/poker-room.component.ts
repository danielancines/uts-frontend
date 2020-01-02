import { PokerRoomsService } from './../poker-rooms.service';
import { Component, OnInit } from '@angular/core';
import { IPokerRoom } from '../poker-room.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageType } from 'app/shared/messageTypes';
import { MessageService } from 'app/shared/message.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsHandlerService } from 'app/errors/errors-handler.service';
import { RolesValidatorService } from 'app/auth/roles-validator.service';
import { Roles } from 'app/auth/roles';
import { fuseAnimations } from '@fuse/animations';
import { ComponentBase } from 'app/shared/base/ComponentBase';

@Component({
  selector: 'app-poker-room',
  templateUrl: './poker-room.component.html',
  styleUrls: ['./poker-room.component.scss'],
  animations: fuseAnimations
})
export class PokerRoomComponent extends ComponentBase implements OnInit {
  pokerRoom: IPokerRoom = this.createPokerRoom();
  pokerRoomId: string;
  pokerRoomForm: FormGroup;
  editing: Boolean = false;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _messageService: MessageService,
    private _activatedRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private _pokerRoomsService: PokerRoomsService,
    private _errorsHandlerService: ErrorsHandlerService,
    private _rolesValidatorService: RolesValidatorService
  ) { 
    super();
  }

  ngOnInit() {
    this.pokerRoomId = this._activatedRoute.snapshot.paramMap.get('id');
    this.editing = this.pokerRoomId ? true : false;
    this.pokerRoomForm = this.createPokerRoomForm();

    if (this.pokerRoomId) {
      this.loadPokerRoom();
    }
  }

  add() {
    if (!this.validateForm(this.pokerRoomForm)) {
      this._messageService.showMessage(MessageType.Error, 'POKER_ROOMS_REGISTRY.ERRORS.FORM_INVALID', '');
      return;
    }

    this._pokerRoomsService.add(this.pokerRoomForm.getRawValue())
      .subscribe((pokerRoom: IPokerRoom) => {
        this._messageService.showMessage(MessageType.Success, 'POKER_ROOMS_MAIN.INSERT_MESSAGES.SUCCESS', '');
        this._router.navigate(['/pokerrooms']);
      })

  }

  save() {
    if (!this.validateForm(this.pokerRoomForm)) {
      this._messageService.showMessage(MessageType.Error, 'POKER_ROOMS_REGISTRY.ERRORS.FORM_INVALID', '');
      return;
    }
    
    this._pokerRoomsService.update(this.pokerRoomForm.getRawValue())
      .subscribe((response) => {
        this._messageService.showMessage(MessageType.Success, 'POKER_ROOMS_MAIN.UPDATE_MESSAGES.SUCCESS', '');
        this._router.navigate(['/pokerrooms']);
      });
  }

  edit(pokerRoom: IPokerRoom) {
    this._pokerRoomsService.update(this.pokerRoomForm.getRawValue())
      .subscribe((response) => {
        this._messageService.showMessage(MessageType.Success, 'POKER_ROOMS_MAIN.UPDATE_MESSAGES.SUCCESS', '');
        this._router.navigate(['/pokerrooms']);
      });
  }

  delete(pokerRoom: IPokerRoom) {
    this._rolesValidatorService.validate(Roles.DeletePokerRoom, 'POKER_ROOMS_ERRORS.DELETE_POKER_ROOM.MESSAGE', 'POKER_ROOMS_ERRORS.DELETE_POKER_ROOM.TITLE')
      .subscribe(result => {
        if (!result) return;

        this._translateService
          .get('GLOBAL.DELETE_QUESTION_MESSAGE')
          .subscribe(translation => {
            this.confirmDialogRef = this._dialog.open(ConfirmDialogComponent, {
              disableClose: false
            });

            this.confirmDialogRef.componentInstance.confirmMessage = translation.MESSAGE;
            this.confirmDialogRef.componentInstance.title = translation.TITLE;
            this.confirmDialogRef.componentInstance.confirmButtonText = translation.CONFIRM_BUTTON_TEXT;
            this.confirmDialogRef.componentInstance.cancelButtonText = translation.CANCEL_BUTTON_TEXT;

            this.confirmDialogRef.afterClosed().subscribe(result => {
              if (result) {
                this._pokerRoomsService.delete(pokerRoom)
                  .subscribe((response) => {
                    this._messageService.showMessage(MessageType.Success, 'POKER_ROOMS_MAIN.DELETE_MESSAGES.SUCCESS', '');
                    this._router.navigate(['/pokerrooms']);
                  },
                    error => {
                      this._errorsHandlerService.handleError(error);
                    });
              }
              this.confirmDialogRef = null;
            });
          });
      });
  }

  private loadPokerRoom() {
    this._pokerRoomsService.getById(this.pokerRoomId)
      .subscribe(pokerRoom => {
        this.pokerRoom = pokerRoom;
        this.pokerRoomForm = this.createPokerRoomForm();
      }, error => {

      })
  }

  private createPokerRoom(): IPokerRoom {
    const newPokerroom: IPokerRoom = {
      _id: '',
      name: '',
      currency: 'en-US'
    };

    return newPokerroom;
  }

  private createPokerRoomForm(): FormGroup {
    const form = this._formBuilder.group({
      _id: [this.pokerRoom._id],
      name: [this.pokerRoom.name, [Validators.required, Validators.minLength(1)]],
      currency: [this.pokerRoom.currency, [Validators.required]]
    });

    return form;
  }

}
