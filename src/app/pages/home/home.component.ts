import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { NewsService } from '../../core/services/news.service';
import { CartService } from '../../core/services/cart.service';
import { ProductSummary } from '../../core/models/product.model';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  /* ── Slider ── */
  currentSlide = 0;
  private sliderTimer: ReturnType<typeof setInterval> | null = null;

  slides = [
    {
      eyebrow: 'New Season',
      line1: 'Wear Better,',
      line2: 'Live Better.',
      sub: 'Premium Jerseys, Teamwear & Sports Apparel for Every Athlete.',
      bg: 'linear-gradient(135deg,#0f2d62 0%,#123a78 30%,#1e5eff 70%,#4f46e5 100%)',
      image: 'assets/Slider1 (2).png',
    features: [
  { icon: 'fa-solid fa-shirt', text: 'Premium Jerseys' },
  { icon: 'fa-solid fa-wind', text: 'Breathable Fabric' },
  { icon: 'fa-solid fa-medal', text: 'Champion Quality' },
]
    },
    {
      eyebrow: 'Best Sellers',
  line1: 'Premium',
  line2: 'Collection' ,
  
  sub: 'High-performance jerseys designed for comfort, durability, and style on and off the field.',
      bg: 'linear-gradient(120deg, #0f3460 0%, #1a3c6e 40%, #16213e 100%)',
      image: 'assets/slider.png',
     features: [
  { icon: 'fa-solid fa-shirt', text: 'Premium Fabric' },
  { icon: 'fa-solid fa-wind', text: 'Breathable Material' },
  { icon: 'fa-solid fa-medal', text: 'Athlete Approved' },
]
    },
    {
      eyebrow: 'Now Available',
      line1: 'Hybrid Cool',
      line2: 'Gel Collection',
      sub: 'Temperature-regulating gel foam + pocket springs for the perfect sleep.',
      bg: 'linear-gradient(120deg, #1e3a5f 0%, #2563eb 55%, #7c3aed 100%)',
      image: 'assets/slider2 (2).png',
      features: [
        { icon: 'fa-solid fa-snowflake', text: 'Cool Gel Technology' },
        { icon: 'fa-solid fa-layer-group', text: 'Hybrid Construction' },
        { icon: 'fa-solid fa-shield-halved', text: '1-Year Warranty' },
      ]
    },
  ];

  /* ── Category circles (TrackhHub style) ── */
  catCircles = [
    { label: 'Dry-Fit T-Shirts', img: 'assets/c 1.jpg.jpeg', path: '/products', params: { category: 'dry-fit' } },
    { label: 'Casual Wear',  img: 'assets/b 1.jpg.jpeg', path: '/products', params: { category: 'casual' } },
    { label: 'Gym & Fitness Wear',      img: 'assets/e 1.jpg.jpeg', path: '/products', params: { category: 'fitness' } },
    { label: 'Latex',       img: 'assets/g 1.jpg.jpeg', path: '/products', params: { category: 'latex' } },
    { label: 'Polo Shirts',     img: 'assets/f 1.jpg.jpeg', path: '/products', params: { category: 'polo' } },
   
  ];

  /* ── Brands ── */
  brands = [
    { name: 'SSports', path: '/products' },
    { name: 'Dryfit',   path: '/products' },
    { name: 'Sunday Special',    path: '/products' },
    { name: 'flex',  path: '/products' },
  
  ];

  /* ── Countdown ── */
  countdown = [
    { value: 8, label: 'HRS' },
    { value: 23, label: 'MINS' },
    { value: 45, label: 'SECS' },
    { value: 16, label: 'MS' },
  ];
  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  /* ── Data signals ── */
  readonly trending = signal<ProductSummary[]>([]);
  readonly dealProducts = signal<ProductSummary[]>([]);
  readonly newsletterEmail = signal('');
  readonly newsletterSubmitted = signal(false);

  readonly testimonials = [
  {
    name: 'Aarav Mehta',
    location: 'Mumbai',
    quote: 'The quality of the cricket jersey exceeded my expectations. The fabric is lightweight, breathable, and perfect for long matches.'
  },
  {
    name: 'Priya Nair',
    location: 'Bengaluru',
    quote: 'Ordered custom jerseys for our football team and everyone loved them. Great fit, vibrant colors, and fast delivery.'
  },
  {
    name: 'Rohan Kapoor',
    location: 'Delhi',
    quote: 'TrackHub delivered premium-quality sportswear at an affordable price. The dry-fit material is excellent for training sessions.'
  }
];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private newsService: NewsService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getTrending().subscribe(res => {
      const products = res.data.slice(0, 8);
      this.trending.set(products);
      this.dealProducts.set(products.slice(0, 6));
    });

    this.sliderTimer = setInterval(() => this.nextSlide(), 5000);
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.sliderTimer) clearInterval(this.sliderTimer);
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  }

  nextSlide(): void { this.currentSlide = (this.currentSlide + 1) % this.slides.length; }
  trackByProductId(index: number, product: ProductSummary): number | string {
  return product.id ?? index;
}
  prevSlide(): void { this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length; }
  goToSlide(i: number): void { this.currentSlide = i; }

  addToCart(product: ProductSummary): void {
    this.cartService.addToCart({ product, quantity: 1 }).subscribe();
  }

  subscribeNewsletter(): void {
    if (this.newsletterEmail().trim()) this.newsletterSubmitted.set(true);
  }

  private startCountdown(): void {
    this.countdownTimer = setInterval(() => {
      let secs = this.countdown[2].value - 1;
      let mins = this.countdown[1].value;
      let hrs  = this.countdown[0].value;
      if (secs < 0) { secs = 59; mins--; }
      if (mins < 0) { mins = 59; hrs--; }
      if (hrs < 0)  { hrs = 8; mins = 59; secs = 59; }
      this.countdown = [
        { value: hrs,  label: 'HRS' },
        { value: mins, label: 'MINS' },
        { value: secs, label: 'SECS' },
        { value: 16,   label: 'MS' },
      ];
    }, 1000);
  }
}
