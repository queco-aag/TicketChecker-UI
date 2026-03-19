# TicketChecker-UI

Reescritura del frontend en React + PrimeReact, conectada al contrato definido en `openapi.yaml`.

## Documentacion centralizada

Toda la documentacion y scripts nuevos se movieron fuera de la raiz:

- Documentacion: `project-resources/docs/README.md`
- Arquitectura: `project-resources/docs/ARQUITECTURA_FRONTEND.md`
- Contrato API: `project-resources/docs/API_CONTRATO_OPENAPI.md`
- Migracion y validacion: `project-resources/docs/MIGRACION_Y_VALIDACION.md`
- Scripts PowerShell: `project-resources/scripts/`

## Arranque rapido

1. Instala dependencias con `npm install`
2. Configura `.env` (ejemplo recomendado):
   - `VITE_API_URL=http://localhost:8080/api/v1`
   - `VITE_API_TIMEOUT=30000`
3. Ejecuta `npm run dev`

## Scripts del proyecto

- `npm run dev`
- `npm run build`
- `npm run lint`

Tambien puedes usar:

- `project-resources/scripts/dev.ps1`
- `project-resources/scripts/build.ps1`
- `project-resources/scripts/lint.ps1`

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
