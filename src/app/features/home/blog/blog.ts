import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IPost } from '../../../core/models/interfaces';
import { SectionHead } from '../../../shared/ui/section-head/section-head';

@Component({
  selector: 'app-blog',
  imports: [SectionHead],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Blog {
  protected readonly posts: IPost[] = [
    {
      image: '/images/blog-1.jpg',
      title: 'Красивая Италия, какая она в реальности?',
      excerpt:
        'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
      date: '01/04/2023',
    },
    {
      image: '/images/blog-2.jpg',
      title: 'Долой сомнения! Весь мир открыт для вас!',
      excerpt:
        'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации ... независимые способы реализации соответствующих...',
      date: '01/04/2023',
      highlighted: true,
    },
    {
      image: '/images/blog-3.jpg',
      title: 'Как подготовиться к путешествию в одиночку?',
      excerpt: 'Для современного мира базовый вектор развития предполагает.',
      date: '01/04/2023',
    },
    {
      image: '/images/blog-4.jpg',
      title: 'Индия ... летим?',
      excerpt: 'Для современного мира базовый.',
      date: '01/04/2023',
    },
  ];
}
