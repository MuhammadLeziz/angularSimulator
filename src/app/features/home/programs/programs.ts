import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IAdvantage } from '../../../core/models/interfaces';
import { SectionHead } from '../../../shared/ui/section-head/section-head';

@Component({
  selector: 'app-programs',
  imports: [SectionHead],
  templateUrl: './programs.html',
  styleUrl: './programs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Programs {
  protected readonly advantages: IAdvantage[] = [
    {
      icon: 'guide',
      title: 'Опытный гид',
      text: 'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
    },
    {
      icon: 'shield',
      title: 'Безопасный поход',
      text: 'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
    },
    {
      icon: 'price',
      title: 'Лояльные цены',
      text: 'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
    },
  ];

  protected readonly gallery = [
    { src: '/images/program-1.jpg', alt: 'Горная река с бирюзовой водой' },
    { src: '/images/program-2.jpg', alt: 'Путешественник на вершине каньона' },
    { src: '/images/program-3.jpg', alt: 'Снегоход в заснеженных горах' },
    { src: '/images/program-4.jpg', alt: 'Зелёная долина у подножия гор' },
  ];
}
