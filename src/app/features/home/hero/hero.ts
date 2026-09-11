import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly locations = ['Тибет', 'Алтай', 'Кавказ', 'Альпы'];

  protected readonly participants = ['1 человек', '2 человека', '3-5 человек', 'Группа'];
}
