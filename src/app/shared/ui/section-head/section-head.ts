import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-head',
  templateUrl: './section-head.html',
  styleUrl: './section-head.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.section-head--center]': 'centered()',
    class: 'section-head',
  },
})
export class SectionHead {
  readonly eyebrow = input.required<string>();

  readonly heading = input.required<string>();

  readonly centered = input(false);
}
