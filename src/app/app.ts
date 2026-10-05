import { NgTemplateOutlet } from '@angular/common';
import { Component, signal } from '@angular/core';

interface Feature {
  title: string;
  body: string;
  image: string;
  alt: string;
  uncropped?: boolean;
}

interface Stat {
  value: string;
  label: string;
}

interface GalleryItem {
  src: string;
  alt: string;
}

@Component({
  imports: [NgTemplateOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly menuOpen = signal(false);
  protected readonly year = new Date().getFullYear();

  protected readonly navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Contact Us', href: '#contact' },
  ];

  protected readonly quote = 'फल की कामना न रखने वाला शास्त्रविधि से कर्तव्य मानकर किया गया यज्ञ';

  protected readonly campText =
    'We as a NGO held up many camps to train, educate and motivate people for free. We give computer, handloom and many other training. We also held camps to motivate and cheer up people.';

  protected readonly features: Feature[] = [
    {
      title: 'Motivational & Training Camp',
      body: this.campText,
      image: 'images/camp-group.jpg',
      alt: 'Volunteers and villagers gathered outdoors at a training camp',
    },
    {
      title: 'Great meet-up with Name name',
      body: this.campText,
      image: 'images/meetup.jpg',
      alt: 'Two men standing side by side at a community meet-up',
    },
    {
      title: 'Public food camp & Ration distribution',
      body: 'We held free food camps tons of times, wherever we were needed, and we also deliver free raw ration to the needy at their doorstep. Our delivery partners and warriors are always there, even in floods, corona or anything else.',
      image: 'images/food-van.jpg',
      alt: 'Trust outreach van with a red banner and a volunteer standing beside it',
      uncropped: true,
    },
  ];

  protected readonly stats: Stat[] = [
    { value: '70+', label: 'Helping and training camps' },
    { value: '1000+', label: 'Educational and Medical support' },
    { value: '9000+', label: 'Happy faces and stomachs' },
  ];

  protected readonly recognitions = [
    {
      title: 'Media Coverage & Recognition',
      body: 'We are happy to share that we got some media coverage and recognition from some channels for holding a motivational camp and felicitation ceremony.',
    },
    {
      title: 'Appreciation & Recognition',
      body: 'We got great appreciation and recognition for our food camp and for our warriors, who delivered food, raw ration and medicines at the doorstep of the needy, even during covid.',
    },
  ];

  protected readonly gallery: GalleryItem[] = [
    { src: 'images/gallery-6.jpg', alt: 'Children sitting in a row sharing a meal' },
    { src: 'images/gallery-11.jpg', alt: 'Villagers receiving white sacks of ration' },
    { src: 'images/gallery-4.jpg', alt: 'Volunteers gathered behind a table with tabla' },
    { src: 'images/gallery-3.jpg', alt: 'Outdoor event under a red banner' },
    { src: 'images/gallery-1.jpg', alt: 'A young boy holding a bowl of food' },
    { src: 'images/gallery-5.jpg', alt: 'Outreach van with a red banner on the hood' },
    { src: 'images/gallery-2.jpg', alt: 'Ceremonial fire during a community ritual' },
    { src: 'images/gallery-7.jpg', alt: 'Volunteers packing bags of grain' },
    { src: 'images/gallery-8.jpg', alt: 'Ration being handed out to families' },
    { src: 'images/gallery-9.jpg', alt: 'Families queueing for a food distribution' },
    { src: 'images/gallery-10.jpg', alt: 'Ration distribution next to a haystack' },
    { src: 'images/gallery-12.jpg', alt: 'Volunteers unloading supplies from a truck' },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
