import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IGalleryItem } from '../../../core/models/interfaces';
import { SectionHead } from '../../../shared/ui/section-head/section-head';

@Component({
  selector: 'app-gallery',
  imports: [SectionHead],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Gallery {
  protected readonly items: IGalleryItem[] = [
    { image: '/images/photo-1.jpg', alt: 'Воздушные шары над долиной', wide: true },
    { image: '/images/photo-2.jpg', alt: 'Фотоаппарат и карта на столе' },
    { image: '/images/photo-3.jpg', alt: 'Побережье Дубая с высоты' },
    { image: '/images/photo-4.jpg', alt: 'Лодки у песчаного пляжа' },
    { image: '/images/photo-5.jpg', alt: 'Путешественница над каньоном', wide: true },
    { image: '/images/photo-6.jpg', alt: 'Блокнот, камера и очки на карте' },
  ];
}
