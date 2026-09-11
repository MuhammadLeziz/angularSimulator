import { ChangeDetectionStrategy, Component } from '@angular/core';
import { About } from '../../features/home/about/about';
import { Blog } from '../../features/home/blog/blog';
import { Gallery } from '../../features/home/gallery/gallery';
import { Hero } from '../../features/home/hero/hero';
import { Popular } from '../../features/home/popular/popular';
import { Programs } from '../../features/home/programs/programs';
import { Subscribe } from '../../features/home/subscribe/subscribe';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Programs, Popular, Blog, Gallery, Subscribe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
