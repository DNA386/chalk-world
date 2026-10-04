import { SECTIONS } from './consts'
import Environment from "./environment";


export default class SectionNav {
  activeSection: string;
  hoveredSection: string | null;
  hoveredPaperUrl: string | null;
  hoveredPaperTitle: string | null;
  navControls: Array<HTMLElement>;
  environment: Environment;

  constructor(environment: Environment) {
    this.activeSection = 'overview';
    this.hoveredSection = null;
    this.hoveredPaperUrl = null;
    this.hoveredPaperTitle = null;
    this.navControls = [...document.querySelectorAll('[data-section]')];

    this.environment = environment;

    const initialSection = this.validSectionFromHash() ?? 'overview';
    this.environment.camera.setCameraBase(
      this.environment.camera.getCameraState(initialSection)
    );
    this.goToSection(initialSection, { immediate: true, updateHash: false });
  }

  goToSection(
    sectionName,
    options: { immediate: boolean, updateHash: boolean } = { immediate: true, updateHash: false}
  ) {
    if (!SECTIONS[sectionName]) return;

    const { immediate, updateHash } = options;
    const targetState = this.environment.camera.getCameraState(sectionName);
    const duration = this.environment.prefersReducedMotion || immediate ? 0 : 1320;

    this.activeSection = sectionName;
    this.updateNavigation();
    // this.environment.updateHighlights();

    // if (statusText) {
    //   const section = SECTIONS[sectionName];
    //   statusText.textContent = sectionName === 'overview'
    //     ? 'Full-board view. Click a chalk section to zoom in.'
    //     : `Viewing ${section.label}. Click another chalk section or use the buttons to pan across the board.`;
    // }

    if (updateHash) {
      window.history.replaceState(null, '', `#${sectionName}`);
    }

    if (duration === 0) {
      this.environment.camera.setCameraBase(targetState);
      this.environment.camera.transition = null;
      return;
    }

    this.environment.camera.transition = {
      start: performance.now(),
      duration,
      from: this.environment.camera.cloneCameraBase(null),
      to: targetState,
    };
  }

  updateNavigation() {
    this.navControls.forEach((control) => {
      const isCurrent = control.dataset.section === this.activeSection;
      control.setAttribute('aria-current', isCurrent ? 'true' : 'false');
    });
  }

  validSectionFromHash() {
    const hash = window.location.hash.replace('#', '').trim();
    return SECTIONS[hash] ? hash : null;
  }

}
