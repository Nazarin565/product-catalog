import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { products } from './schema';

const SEED_PRODUCTS = [
  { name: 'Wireless Headphones', description: 'Over-ear noise cancelling headphones with 30h battery', price: '149.99' },
  { name: 'Mechanical Keyboard', description: 'TKL layout with Cherry MX Brown switches', price: '89.99' },
  { name: 'USB-C Hub 7-in-1', description: 'HDMI 4K, 3× USB-A, SD card reader, 100W PD', price: '39.99' },
  { name: 'Ergonomic Mouse', description: 'Vertical design, 6 programmable buttons, 4000 DPI', price: '54.99' },
  { name: '27" 4K Monitor', description: 'IPS panel, 144Hz, HDR400, USB-C 65W', price: '499.99' },
  { name: 'Webcam 1080p', description: 'Auto-focus, built-in dual mic, privacy shutter', price: '69.99' },
  { name: 'Laptop Stand', description: 'Aluminium, adjustable height, foldable', price: '29.99' },
  { name: 'LED Desk Lamp', description: 'Touch dimmer, 3 colour modes, USB charging port', price: '34.99' },
  { name: 'External SSD 1TB', description: 'USB 3.2 Gen 2, 1050 MB/s read, shock-resistant', price: '109.99' },
  { name: 'Portable Charger 20000mAh', description: '65W PD, 3 ports, charges laptops', price: '59.99' },
  { name: 'Smart Speaker', description: 'Wi-Fi + Bluetooth, voice assistant, 360° sound', price: '79.99' },
  { name: 'Streaming Microphone', description: 'Cardioid condenser, USB-C, built-in headphone jack', price: '99.99' },
  { name: 'HDMI 2.1 Cable 2m', description: '8K@60Hz, 4K@120Hz, 48Gbps bandwidth', price: '14.99' },
  { name: 'Ethernet Switch 8-Port', description: 'Gigabit unmanaged, plug-and-play', price: '24.99' },
  { name: 'Wi-Fi 6 Router', description: 'AX3000, dual-band, MU-MIMO, 4 antennas', price: '89.99' },
  { name: 'Desk Mat XL', description: '90×40cm, stitched edges, non-slip base', price: '19.99' },
  { name: 'Cable Management Box', description: 'Holds power strip + cables, wood finish', price: '22.99' },
  { name: 'Wrist Rest Keyboard', description: 'Memory foam, non-slip, 43cm wide', price: '16.99' },
  { name: 'Monitor Arm Single', description: 'Full-motion VESA 75/100, clamp or grommet mount', price: '44.99' },
  { name: 'Smart Plug 4-Pack', description: 'Wi-Fi, energy monitoring, voice control', price: '32.99' },
  { name: 'USB Microphone Pop Filter', description: 'Dual-layer mesh, flexible gooseneck, clip mount', price: '9.99' },
  { name: 'Ring Light 10"', description: '3 colour temps, 10 brightness levels, phone holder', price: '27.99' },
  { name: 'Gaming Chair', description: 'Lumbar + neck pillow, recline 90–135°, armrests 4D', price: '249.99' },
  { name: 'Standing Desk Converter', description: 'Gas spring, 80×40cm surface, dual-monitor ready', price: '179.99' },
  { name: 'Thermal Paste 3g', description: 'Silver compound, 8.5 W/m·K conductivity', price: '7.99' },
  { name: 'Anti-glare Screen Filter 27"', description: 'Blocks 99% UV, easy clip-on attachment', price: '18.99' },
  { name: 'Bluetooth Numpad', description: 'Slim, rechargeable, compatible with macOS/Windows', price: '29.99' },
  { name: 'Presenter Remote', description: 'USB receiver, 100m range, laser pointer', price: '24.99' },
  { name: 'NVMe SSD 512GB M.2', description: 'PCIe 4.0, 7000 MB/s read, 5-year warranty', price: '64.99' },
  { name: 'ATX Power Supply 750W', description: '80+ Gold, fully modular, 120mm quiet fan', price: '99.99' },
];

async function seed() {
  const pool = new Pool({
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number(process.env.DATABASE_PORT ?? 5432),
    user: process.env.DATABASE_USER ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? 'postgres',
    database: process.env.DATABASE_NAME ?? 'universe',
  });

  const db = drizzle(pool);

  console.log(`Seeding ${SEED_PRODUCTS.length} products…`);
  await db.insert(products).values(SEED_PRODUCTS);
  console.log('Done.');

  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
