'use client'

import { useEffect, useRef } from 'react'

const NATIONS = [
  { name: 'Othaala', description: 'Elven nation of the west' },
  { name: 'Huozhi', description: 'Demonic nation of the southwest' },
  { name: 'Frithre', description: 'Human territories of the center and east' },
  { name: 'Qauta', description: 'Fairy nation of the northwest' },
  { name: 'Herat', description: 'Angelic nation of the central east' },
  { name: 'Almania', description: 'Dragonkin nation of the central region' },
  { name: 'Birumiaka', description: 'Beastfolk nation of the far east' },
  { name: "A'Amaer", description: 'Ghoul nation of the eastern coast' },
]

// Image dimensions (in pixels)
const IMG_W = 7200
const IMG_H = 5400

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      // Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      // Use a simple pixel CRS so the image fills the map
      const crs = L.CRS.Simple

      const map = L.map(mapRef.current!, {
        crs,
        minZoom: -4,
        maxZoom: 2,
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        attributionControl: false,
        zoomControl: false,
      })

      // Bounds: top-left [0,0] to bottom-right [H, W] in yx order for Leaflet
      const bounds: L.LatLngBoundsExpression = [[-IMG_H, 0], [0, IMG_W]]

      L.imageOverlay('/images/map-alatrya.png', bounds).addTo(map)

      map.fitBounds(bounds)
      map.setMaxBounds([[-IMG_H * 1.1, -IMG_W * 0.1], [IMG_H * 0.1, IMG_W * 1.1]])

      // Custom zoom control — bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      leafletRef.current = map
    })

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove()
        leafletRef.current = null
      }
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.2s; }
        .d3 { animation-delay: 0.3s; }

        /* Leaflet overrides to match site theme */
        .leaflet-container {
          background: var(--navy-deepest) !important;
          font-family: 'Cinzel', serif !important;
        }
        .leaflet-control-zoom {
          border: 1px solid var(--border) !important;
          border-radius: 2px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out {
          background: var(--navy-mid) !important;
          color: var(--gold-mid) !important;
          border-bottom: 1px solid var(--border) !important;
          font-size: 1.1rem !important;
          line-height: 26px !important;
          width: 28px !important;
          height: 28px !important;
          transition: background 0.2s !important;
        }
        .leaflet-control-zoom-in:hover,
        .leaflet-control-zoom-out:hover {
          background: var(--navy-light) !important;
          color: var(--gold-bright) !important;
        }
        .leaflet-control-zoom-out {
          border-bottom: none !important;
        }

        .map-frame {
          border: 1px solid var(--border);
          border-top: 2px solid var(--gold-dim);
          position: relative;
          overflow: hidden;
        }

        .map-corner-label {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          font-family: 'Cinzel', serif;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold-dim);
          background: rgba(13, 13, 26, 0.8);
          padding: 0.3rem 0.7rem;
          backdrop-filter: blur(4px);
          z-index: 1000;
          pointer-events: none;
        }

        .map-hint {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          font-family: 'Cinzel', serif;
          font-size: 0.55rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--cream-muted);
          background: rgba(13, 13, 26, 0.8);
          padding: 0.3rem 0.7rem;
          backdrop-filter: blur(4px);
          z-index: 1000;
          pointer-events: none;
        }

        .nation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }
        .nation-item {
          background: var(--navy-mid);
          border: 1px solid var(--border);
          padding: 0.9rem 1rem;
          transition: border-color 0.2s, background 0.2s;
        }
        .nation-item:hover {
          border-color: var(--border-bright);
          background: var(--navy-light);
        }
        .nation-name {
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--gold-mid);
          margin-bottom: 0.2rem;
        }
        .nation-desc {
          font-size: 0.82rem;
          color: var(--cream-muted);
        }
      `}</style>

      <div className="page-container" style={{ paddingBottom: '5rem' }}>

        {/* ── Page header ── */}
        <div className="page-header fade-up d1">
          <p className="eyebrow">World of Nasariane</p>
          <h1 style={{ marginBottom: '0.5rem' }}>Map of Alatrya</h1>
          <p style={{ maxWidth: '520px', fontSize: '1.05rem', marginBottom: 0 }}>
            The small continent of Alatrya — home to eight nations, ten elements, and millenia of history.
          </p>
          <div className="gold-divider" style={{ marginTop: '2rem' }}>
            <span className="gold-divider-icon">✦</span>
          </div>
        </div>

        {/* ── Map viewer ── */}
        <div className="map-frame fade-up d2" style={{ marginBottom: '3rem', position: 'relative' }}>
          <div className="map-corner-label">Alatrya</div>
          <div className="map-hint">Scroll to zoom · Click and drag to pan</div>
          <div
            ref={mapRef}
            style={{ width: '100%', height: '75vh', minHeight: '500px' }}
          />
        </div>

        {/* ── Nations key ── */}
        <div className="fade-up d3">
          <h2 style={{
            fontSize: '0.75rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--gold-dim)',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '0.5rem',
            marginBottom: '1.25rem',
          }}>
            Nations of Alatrya
          </h2>
          <div className="nation-grid">
            {NATIONS.map(nation => (
              <div key={nation.name} className="nation-item">
                <div className="nation-name">{nation.name}</div>
                <div className="nation-desc">{nation.description}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
