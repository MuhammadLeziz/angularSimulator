import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { INavLink } from '../../core/models/interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly isMenuOpen = signal(false);

  protected readonly navLinks: INavLink[] = [
    { label: 'Главная', href: '#hero' },
    { label: 'Про гида', href: '#about' },
    { label: 'Программа тура', href: '#programs' },
    { label: 'Стоимость', href: '#popular' },
    { label: 'Блог', href: '#blog' },
    { label: 'Контакты', href: '#footer' },
  ];

  protected toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
