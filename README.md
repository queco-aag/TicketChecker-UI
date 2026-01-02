# TicketChecker-UI

Frontend web application for ASPADIF's lottery/raffle prize management system. Built with React and PrimeReact.

![ASPADIF Logo](http://www.aspadif.org/photogallery/logos/)

> **Version 2.0.0** - Actualizado con nueva arquitectura de API REST. Ver [CHANGELOG.md](CHANGELOG.md) para detalles.

## 📚 Documentación

- **[SUMMARY.md](SUMMARY.md)** - Resumen ejecutivo de cambios y adaptación
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Guía completa de migración v2.0
- **[API_INTEGRATION.md](API_INTEGRATION.md)** - Documentación de endpoints de la API
- **[docs/API_INTEGRATION_GUIDE.md](docs/API_INTEGRATION_GUIDE.md)** - Guía técnica de integración
- **[CHANGELOG.md](CHANGELOG.md)** - Historial de cambios
- **[VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)** - Lista de verificación

## 🎯 About

TicketChecker-UI is a complete web frontend for managing lottery/raffle prizes for ASPADIF (Asociación de Padres de Personas con Discapacidad Intelectual de Fuenlabrada). The application provides a public interface for ticket verification and prize claiming, as well as an administrative panel for managing prizes and shipments.

## 🎨 Branding

The application follows ASPADIF's visual identity:

- **Primary Color:** Blue (#2196F3, #1976D2)
- **Secondary Color:** Light Blue (#64B5F6)
- **Accent Color:** White (#FFFFFF)
- **Text Color:** Dark Gray (#333333)
- **Success:** Green (#4CAF50)
- **Warning:** Orange (#FF9800)
- **Error:** Red (#F44336)

## ✨ Features

### Public Features
- **Ticket Verification:** Users can check if their ticket number has won a prize
- **Prize Claiming:** Winners can submit their information to claim prizes
- **File Upload:** Attach proof of ticket ownership (photo)

### Admin Features
- **Dashboard:** Overview of total prizes, claimed, pending, and shipped
- **CSV Upload:** Bulk load prizes from CSV file
- **Prize Management:** View and manage all claimed prizes
- **Pending Shipments:** Track prizes awaiting shipment
- **Shipped Prizes:** View history of shipped prizes
- **Export to CSV:** Export prize data

## 🛠️ Tech Stack

- **React 18+** with Vite
- **PrimeReact** - UI component library
- **PrimeIcons** - Icon library
- **PrimeFlex** - CSS utility framework
- **Axios** - HTTP client
- **React Router DOM** - Routing
- **Docker** - Containerization
- **Nginx** - Production web server

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (for containerized deployment)

## 🚀 Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/queco-aag/TicketChecker-UI.git
cd TicketChecker-UI
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```
VITE_API_URL=http://localhost:8080/api
VITE_APP_TITLE=TicketChecker - ASPADIF
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t ticketchecker-ui .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`

### Environment Variables in Docker

You can override environment variables in `docker-compose.yml`:

```yaml
environment:
  - VITE_API_URL=http://your-backend-api:8080/api
  - VITE_APP_TITLE=TicketChecker - ASPADIF
```

## 📁 Project Structure

```
src/
├── assets/                 # Static assets
├── components/
│   ├── layout/            # Layout components (Header, Footer, Layout)
│   ├── public/            # Public-facing components
│   │   ├── VerificarNumero.jsx    # Ticket verification
│   │   └── ReclamarPremio.jsx     # Prize claiming form
│   └── admin/             # Admin panel components
│       ├── AdminPanel.jsx         # Admin dashboard
│       ├── CargarPremios.jsx      # CSV upload
│       ├── ListaPremios.jsx       # All prizes list
│       ├── ListaEnviados.jsx      # Shipped prizes
│       └── ListaPendientes.jsx    # Pending prizes
├── services/
│   └── api.js            # API service layer
├── config/
│   └── constants.js      # App configuration
├── App.jsx               # Main app with routing
├── App.css               # Global styles
└── main.jsx             # Entry point
```

## 🔌 API Integration

The application integrates with the TicketChecker backend API. Configure the API URL in the `.env` file.

### API Endpoints Used

#### Public Endpoints
- `GET /api/tickets/{numero}/verify` - Verify ticket number and check for prize
- `POST /api/tickets/{numero}/claim` - Claim a prize with winner information

#### Admin Endpoints
- `POST /api/admin/rewards/upload` - Upload prizes from CSV file
- `GET /api/admin/rewards/claimed` - Get all claimed prizes
- `GET /api/admin/rewards/pending` - Get prizes pending shipment
- `GET /api/admin/rewards/shipped` - Get shipped prizes
- `PUT /api/admin/rewards/{id}/ship` - Mark a prize as shipped
- `GET /api/admin/rewards` - Get all loaded prizes
- `DELETE /api/admin/rewards/{id}` - Delete a prize

#### Authentication Endpoints (Future)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify authentication token

### API Request/Response Examples

#### Verify Ticket
**Request:**
```
GET /api/tickets/12345/verify
```

**Response (200 OK):**
```json
{
  "hasReward": true,
  "ticket": {
    "number": "12345",
    "reward": {
      "id": 1,
      "name": "Bicicleta",
      "description": "Bicicleta de montaña",
      "imageUrl": "https://ejemplo.com/bici.jpg",
      "claimed": false
    }
  }
}
```

#### Claim Prize
**Request:**
```
POST /api/tickets/12345/claim
Content-Type: multipart/form-data

nombre=Juan Pérez
contacto=juan@email.com
direccion=Calle Principal 123
comprobante=[file]
```

**Response (200 OK):**
```json
{
  "message": "Premio reclamado exitosamente",
  "claimId": 123
}
```

### CSV Format for Prize Upload

The CSV file must have the following columns:

```csv
numero,nombrePremio,descripcionPremio,urlFotoPremio
001,Bicicleta,Bicicleta de montaña,https://ejemplo.com/bici.jpg
002,Tablet,Tablet 10 pulgadas,https://ejemplo.com/tablet.jpg
003,Auriculares,Auriculares inalámbricos,https://ejemplo.com/auriculares.jpg
```

**Column descriptions:**
- `numero` (required): Número del ticket
- `nombrePremio` (required): Nombre del premio
- `descripcionPremio` (optional): Descripción del premio
- `urlFotoPremio` (optional): URL de la foto del premio

## 🎯 Usage

### For End Users

1. Navigate to the home page
2. Enter your ticket number
3. Click "Verificar" to check if you won
4. If you won, click "Reclamar Premio"
5. Fill out the form with your details
6. Upload a photo of your ticket
7. Submit the form

### For Administrators

1. Navigate to `/admin`
2. View dashboard statistics
3. Upload prizes via CSV in "Cargar Premios"
4. Manage prizes in the different lists
5. Mark prizes as shipped when delivered
6. Export data to CSV for records

## 🖼️ Logo Setup

To add the ASPADIF logo:

1. Download the logo from: http://www.aspadif.org/photogallery/logos/
2. Save as `public/assets/logo-aspadif.png`
3. The header will automatically display the logo

## 🌐 Routes

- `/` - Home page (ticket verification)
- `/reclamar/:numero` - Prize claim form
- `/admin` - Admin dashboard
- `/admin/cargar` - Upload prizes CSV
- `/admin/premios` - All prizes list
- `/admin/enviados` - Shipped prizes
- `/admin/pendientes` - Pending shipments

## 🔒 Security Notes

- File uploads are validated (type and size)
- Forms include client-side validation
- API calls include error handling
- Confirmation dialogs for destructive actions

**Note:** This version does not include authentication. For production use, consider adding authentication for admin routes.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Components use functional components with hooks
- Spanish language for all UI text
- PrimeReact components used throughout
- Responsive design (mobile-first)
- Error handling with toast notifications

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is developed for ASPADIF (Asociación de Padres de Personas con Discapacidad Intelectual de Fuenlabrada).

## 📞 Contact

For questions or support, contact ASPADIF:
- Website: http://www.aspadif.org

---

Developed with ❤️ for ASPADIF
