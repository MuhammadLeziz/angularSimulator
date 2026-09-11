import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IDestination } from '../../../core/models/interfaces';
import { SectionHead } from '../../../shared/ui/section-head/section-head';

@Component({
  selector: 'app-popular',
  imports: [SectionHead],
  templateUrl: './popular.html',
  styleUrl: './popular.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Popular {
  protected readonly destinations: IDestination[] = [
    {
      image: '/images/popular-1.jpg',
      title: 'Озеро возле гор',
      subtitle: 'романтическое приключение',
      price: '480 $',
      rating: '4.9',
    },
    {
      image: '/images/popular-2.jpg',
      title: 'Ночь в горах',
      subtitle: 'в компании друзей',
      price: '500 $',
      rating: '4.5',
    },
    {
      image: '/images/popular-3.jpg',
      title: 'Растяжка в горах',
      subtitle: 'для тех, кто заботится о себе',
      price: '230 $',
      rating: '5.0',
    },
  ];
}
