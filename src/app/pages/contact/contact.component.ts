import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  form = { name: '', email: '', subject: '', message: '' };
  readonly submitted = signal(false);

  readonly faqs = [
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 3-7 business days depending on your location. Mattresses are compressed and rolled for easier delivery and will expand fully within 24-48 hours of unboxing.'
    },
    {
      question: 'What is your trial and return policy?',
      answer: 'Every mattress comes with a 100-night risk-free trial. If you are not satisfied, contact us within 100 nights of delivery for a free pickup and full refund.'
    },
    {
      question: 'What warranty do mattresses come with?',
      answer: 'All DreamNest mattresses include a 10-year warranty against manufacturing defects such as sagging or material faults.'
    },
    {
      question: 'How do I track my order?',
      answer: 'Once logged in, go to "My Orders" to view real-time status updates for all your orders.'
    },
    {
      question: 'Do you offer bulk discounts for hotels and businesses?',
      answer: 'Yes! Contact us with your quantity and requirements and we will get back to you with a custom quote.'
    }
  ];

  submit(): void {
    this.submitted.set(true);
    this.form = { name: '', email: '', subject: '', message: '' };
  }
}
