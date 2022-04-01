import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CardsService } from 'src/app/services/cards/cards.service';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent implements OnInit, OnDestroy{

  cards: any[] = [];

  form !: FormGroup; //agrupacion de elementos que componen un formulario, se complementa con FormBuilder para formar este formulario armando los componentes del FormGroup

  action = 'Agregar';

  id : number | undefined;

  suscription !: Subscription;

  constructor(private fb : FormBuilder, private toastr: ToastrService, private _CardsService:CardsService) {

    this.form = this.fb.group({
      owner: ['', [Validators.required, Validators.minLength(10)]],
      card: ['',[Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      exp: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]]
    });

  }

  ngOnInit(): void {
    this.GetCards();
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
    console.log('OnDestroy');
  }

  GetCards(){
    this.suscription = this._CardsService.getListCards().subscribe(data => {
      this.cards = data;
    }, 
    error =>{
       console.log(error)
    })
  }

  AddCard(){
    const newcard: any = {
      owner: this.form.get('owner')?.value,
      card: this.form.get('card')?.value,
      exp: this.form.get('exp')?.value,
      cvv: this.form.get('cvv')?.value,
    };

    if(this.id == undefined){
      this.suscription = this._CardsService.addCard(newcard).subscribe(data =>{
        this.toastr.success('La Tarjeta Fue Registrada', 'Hecho!');
        this.GetCards();
        this.form.reset();
      },
      error =>{
        this.toastr.error('Ocurrio Un Error', 'Opss!');
        console.log(error)
      })
    } 
    else{
      newcard.id = this.id;
      this.suscription = this._CardsService.updateCard(this.id, newcard).subscribe(data => {
        this.form.reset();
        this.action = 'Agregar';
        this.id  = undefined;
        this.toastr.info('La Tarjeta Fue Actualizada', 'Hecho');
        this.GetCards();
      },
      error => {
        this.toastr.error('Ocurrio Un Error', 'Opss!');
        console.log(error);
      })
    }


  }

  DeleteCard(id: number){
    this.suscription = this._CardsService.deleteCard(id).subscribe(data =>{
      this.toastr.success('La Tarjeta Fue Eliminada', 'Hecho!');
      this.GetCards();
    }, 
    error => {
      this.toastr.error('Ocurrio Un Error', 'Opss!');
      console.log(error)
    })
  }

  UpdateCard(card:any){
    this.action = 'Editar';
    this.id = card.id;
    this.form.patchValue({
      owner: card.owner,
      card: card.card,
      exp: card.exp,
      cvv: card.cvv
    })
  }


  /*
  Server=localhost\SQLEXPRESS;Database=master;Trusted_Connection=True;
  */
}
