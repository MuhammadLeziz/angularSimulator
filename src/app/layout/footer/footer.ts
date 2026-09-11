import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IFooterColumn } from '../../core/models/interfaces';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly columns: IFooterColumn[] = [
    {
      title: 'Наши услуги',
      links: [
        'Прогулки в горы летом',
        'Зимние походы в горы',
        'Посещение храмов в горах',
        'Экстремальные виды туризма',
        'Походы в джунглях Амазонии',
        'Поездка в Африку',
      ],
    },
    {
      title: 'Важно для путешествий',
      links: [
        'Как собрать в долгий поход?',
        'Жизненно важные предметы для похода',
        'Медицинская страховка, гарантии безопасности',
        'Если вы врач - загляните сюда',
      ],
    },
  ];

  protected readonly socials = [
    { name: 'Telegram', href: '#', icon: 'telegram' },
    { name: 'ВКонтакте', href: '#', icon: 'vk' },
    { name: 'Pinterest', href: '#', icon: 'pinterest' },
    { name: 'Skype', href: '#', icon: 'skype' },
  ];
}
