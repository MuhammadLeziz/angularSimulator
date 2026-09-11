import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHead } from '../../../shared/ui/section-head/section-head';

@Component({
  selector: 'app-about',
  imports: [SectionHead],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {}
