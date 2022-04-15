import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ingredient } from 'src/app/models/ingredient';
import { IngredientUnit } from 'src/app/models/ingredient-unit';
import { IngredientService } from 'src/app/services/ingredient.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-create-new-ingredient',
  templateUrl: './create-new-ingredient.component.html',
  styleUrls: ['./create-new-ingredient.component.css']
})
export class CreateNewIngredientComponent implements OnInit {

  submitted: boolean | undefined;
  newIngredient: Ingredient;
  ingredientUnits: any[];
  ingredientUnit: String | undefined;
  ingredientUnitEnum: IngredientUnit | undefined;

  resultSuccess: boolean;
  resultError: boolean;
  message: string | undefined;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    private ingredientService: IngredientService) {
    this.submitted = false;
    this.newIngredient = new Ingredient();
    this.resultSuccess = false;
    this.resultError = false;
    
    this.ingredientUnits = Object.keys(IngredientUnit);
    
  }

  ngOnInit(): void {
  }

  clear(): void {
    this.submitted = false;
    this.newIngredient = new Ingredient();
  }

  create(createIngredientForm: NgForm) {

    if (createIngredientForm.valid) {

      this.ingredientUnitEnum = this.ingredientUnit as IngredientUnit;

      this.ingredientService.createNewIngredient(this.newIngredient).subscribe({
        next: (response) => {
          let newIngredientId: number = response;
          this.resultSuccess = true;
          this.resultError = false;
          this.message = "New Ingredient" + newIngredientId + " created successfully!";

          this.newIngredient = new Ingredient();
          createIngredientForm.resetForm();
          createIngredientForm.reset();
        },
        error: (error) => {
          this.resultError = true;
          this.resultSuccess = false;
          this.message = "An error has occurred while creating the new Ingredient: " + error;

          console.log('********** CreateNewIngredientComponent.ts: ' + error);
        }
      });
    }
  }

  checkAccessRight() {
    if (!this.sessionService.checkAccessRight(this.router.url)) {
      this.router.navigate(["/accessRightError"]);
    }
  }

}
