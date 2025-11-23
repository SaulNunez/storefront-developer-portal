import { Component, inject, signal } from '@angular/core';
import { AppCategoriesService } from '../app-categories-service';
import { AppCategory } from '../app-category';

@Component({
  selector: 'app-application-create',
  imports: [],
  templateUrl: './application-create.html',
  styleUrl: './application-create.css',
})
export class ApplicationCreate {
  protected appCategoryService = inject(AppCategoriesService);
  protected loadingAppCategories = signal(true);
  protected appCategoryList = signal<AppCategory[]>([]);

  constructor(){
    this.appCategoryService.getApplicationCategories().subscribe((value) => {
      this.loadingAppCategories.set(false);
      this.appCategoryList.set(value);
    });
  }
}
