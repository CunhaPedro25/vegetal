import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Restaurant} from "../../models/restaurant.model";
import {Item} from "../../models/item.model";
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent  implements OnInit {
  @Input() item!: Item;
  counter!: number;

  constructor(private storage: Storage, private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    this.counter = 0;
    await this.storage.create();
    await this.storage.get(`item_${this.item.id}_counter`).then((value) => {
      if (value !== null) {
        this.counter = value;
      }
    });
    this.cdr.detectChanges();
  }

  async incrementCounter() {
    this.counter++;
    await this.saveCounter();
    this.cdr.detectChanges();
  }

  async decrementCounter() {
    if (this.counter > 0) {
      this.counter--;
      await this.saveCounter();
      this.cdr.detectChanges();
    }
  }

   private async saveCounter() {
    // Save the counter value to Ionic Storage
    await this.storage.set(`item_${this.item.id}_counter`, this.counter);
  }
}
