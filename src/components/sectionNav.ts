import { BASE_SECTIONS, INITIAL_SECTION } from './consts'
import Environment from "./environment";

export type SectionNavConf = {
    label: string,
    camera: {
        position: number[],
        target: number[],
        fov: number
    },
}


export default class SectionNav {
  activeSection: string;
  hoveredSection: string | null;
  hoveredPaperUrl: string | null;
  hoveredPaperTitle: string | null;
  navControls: Array<HTMLElement>;
  environment: Environment;
  allSections: {[k: string]: SectionNavConf}
  shortcuts: {[k: string]: string}

  constructor(environment: Environment) {
    this.activeSection = 'overview';
    this.hoveredSection = null;
    this.hoveredPaperUrl = null;
    this.hoveredPaperTitle = null;
    this.navControls = [...document.querySelectorAll('[data-section]')];

    this.environment = environment;
    this.initSubsections([])

    const initialSection = this.validSectionFromHash() ?? INITIAL_SECTION;
    this.environment.camera.setCameraBase(
      this.environment.camera.getCameraState(initialSection, this.allSections[initialSection])
    );
    this.goToSection(initialSection, { immediate: true, updateHash: false });

    window.addEventListener('keyup', (event) => this.resolveKeyboardNav(event))

  }

  initSubsections(subsections: SectionNavConf[]) {
    this.allSections = subsections.reduce((o, section) => {
      return { ...o, [section.label]: section}
    }, BASE_SECTIONS)

    this.shortcuts = Object.entries(this.allSections).reduce((o, [key, sec]) => {
      return {...o, [sec.shortcut]: key}
    }, {})
  }

  goToSection(
    sectionName,
    options: { immediate: boolean, updateHash: boolean } = { immediate: true, updateHash: false}
  ) {
    if (!this.allSections[sectionName]) return;

    const { immediate, updateHash } = options;
    const targetState = this.environment.camera.getCameraState(sectionName, this.allSections[sectionName]);
    const duration = this.environment.prefersReducedMotion || immediate ? 0 : 1320;

    this.activeSection = sectionName;
    this.updateNavigation();

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
    return this.allSections[hash] ? hash : null;
  }

  resolveKeyboardNav(event: KeyboardEvent) {
    if (Object.keys(this.shortcuts).includes(event.key)) {
      this.goToSection(this.shortcuts[event.key], {immediate: false, updateHash: true});
    }
  }

  handleSectionClicked(event: {type: string, section: string, index: number}) {
    // Turn it into a key event
    const keyEvent = new KeyboardEvent("keyup", {key: `${event.index ?? BASE_SECTIONS[INITIAL_SECTION].shortcut}`})
    this.resolveKeyboardNav(keyEvent)
  }
 }
