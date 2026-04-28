'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const NATIONS = [
  { name: 'Othaala', slug: "othaala", description: 'Elven nation of the west', cap_coords: [-3340.941, 1248.667], cap_name: "Lumen", cap_slug: "lumen" },
  { name: 'Huozhi', slug: "huozhi", description: 'Demonic nation of the northwest', cap_coords: [-867.423, 1261.500], cap_name: "Ranshao", cap_slug: "ranshao" },
  { name: 'Frithre', slug: "frithre", description: 'Human territories of the center and east', cap_coords: [-2602.201, 4941.500], cap_name: "Godascher", cap_slug: "godascher" },
  { name: 'Qauta', slug: "qauta", description: 'Faeric nation of the northwest', cap_coords: [-1198.668, 3340.483], cap_name: "Rrroma", cap_slug: "rrroma" },
  { name: 'Herat', slug: "herat", description: 'Angelic nation of the northeast', cap_coords: [-1371.708, 4188.500], cap_name: "Atema", cap_slug: "latema" },
  { name: 'Almania', slug: "almania", description: 'Dragonkinnian nation of the southern region', cap_coords: [-4876.189, 4464.000], cap_name: "Caimania", cap_slug: "caimania" },
  { name: 'Birumiaka', slug: "birumiaka", description: 'Beastfolk nation of the southeast', cap_coords: [-3970.940, 6053.750], cap_name: "Samaiku", cap_slug: "samaiku" },
  { name: "A'Amaer", slug: "aamaer", description: 'Ghoulish nation of the southeast', cap_coords: [-3790.206, 5665.250], cap_name: "Spola", cap_slug: "spola" },
]

const IMG_W = 7200
const IMG_H = 5400

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletRef = useRef<any>(null)

  useEffect(() => {
    if (leafletRef.current) {
      leafletRef.current.remove()
      leafletRef.current = null
    }
    if (mapRef.current) {
      (mapRef.current as any)._leaflet_id = null
    }
    if (!mapRef.current) return

    import('leaflet').then((L) => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      const map = L.map(mapRef.current!, {
        crs: L.CRS.Simple,
        minZoom: -4,
        maxZoom: 2,
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        attributionControl: false,
        zoomControl: false,
      })

      const bounds: L.LatLngBoundsExpression = [[-IMG_H, 0], [0, IMG_W]]
      L.imageOverlay('/images/map-alatrya.png', bounds).addTo(map)

      const goldIcon = L.divIcon({
        className: '',
        html: `<div style="
          width: 10px; height: 10px;
          background: #d4af6a;
          border: 2px solid #0d0d1a;
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(212,175,106,0.6);
        "></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      })

      NATIONS.forEach(nation => {
        L.marker([nation.cap_coords[0], nation.cap_coords[1]], { icon: goldIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: 'Cinzel', serif; min-width: 140px;">
              <div style="font-size: 0.85rem; font-weight: 600; color: #d4af6a; margin-bottom: 0.3rem;">
                ${nation.cap_name}, capital of ${nation.name}
              </div>
              <div style="font-size: 0.78rem; color: #9a9080; margin-bottom: 0.5rem;">
                ${nation.description}
              </div>
              <a href="/lore/cities/${nation.slug}/${nation.cap_slug}"
                style="font-size: 0.7rem; color: #d4af6a; letter-spacing: 0.1em; text-transform: uppercase;">
                View Lore →
              </a>
            </div>
          `)
      })

      map.fitBounds(bounds)
      map.setMaxBounds([[-IMG_H * 1.1, -IMG_W * 0.1], [IMG_H * 0.1, IMG_W * 1.1]])
      L.control.zoom({ position: 'bottomright' }).addTo(map)
      leafletRef.current = map

      setTimeout(() => {
        map.invalidateSize()
        map.fitBounds(bounds)
      }, 100)
    })

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove()
        leafletRef.current = null
      }
      if (mapRef.current) {
        (mapRef.current as any)._leaflet_id = null
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
        .leaflet-control-zoom-out { border-bottom: none !important; }
        .map-frame {
          border: 1px solid var(--border);
          border-top: 2px solid var(--gold-dim);
          position: relative;
          overflow: visible;
        }
        .map-corner-label {
          position: absolute; top: 0.75rem; left: 0.75rem;
          font-family: 'Cinzel', serif; font-size: 0.6rem; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold-dim);
          background: rgba(13,13,26,0.8); padding: 0.3rem 0.7rem;
          backdrop-filter: blur(4px); z-index: 1000; pointer-events: none;
        }
        .map-hint {
          position: absolute; bottom: 0.75rem; left: 0.75rem;
          font-family: 'Cinzel', serif; font-size: 0.55rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--cream-muted);
          background: rgba(13,13,26,0.8); padding: 0.3rem 0.7rem;
          backdrop-filter: blur(4px); z-index: 1000; pointer-events: none;
        }
        .leaflet-popup-content-wrapper {
          background: var(--navy-mid) !important; border: 1px solid var(--border) !important;
          border-radius: 2px !important; box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important; padding: 0 !important;
        }
        .leaflet-popup-content { margin: 0.75rem 1rem !important; color: var(--cream-dim) !important; }
        .leaflet-popup-tip { background: var(--navy-mid) !important; }
        .leaflet-popup-close-button { color: var(--gold-dim) !important; font-size: 1rem !important; padding: 0px !important; }
        .leaflet-popup-close-button:hover { color: var(--gold-bright) !important; background: none !important; }
        .nation-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
        .nation-item {
          background: var(--navy-mid); border: 1px solid var(--border);
          padding: 0.9rem 1rem; transition: border-color 0.2s, background 0.2s;
        }
        .nation-item:hover { border-color: var(--border-bright); background: var(--navy-light); }
        .nation-name { font-family: 'Cinzel', serif; font-size: 0.85rem; font-weight: 600; color: var(--gold-mid); margin-bottom: 0.2rem; }
        .nation-desc { font-size: 0.82rem; color: var(--cream-muted); }
      `}</style>

      <div className="page-container" style={{ paddingBottom: '5rem' }}>
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

        <div className="map-frame fade-up d2" style={{ marginBottom: '3rem', position: 'relative' }}>
          <div className="map-corner-label">Alatrya</div>
          <div className="map-hint">Scroll to zoom · Click and drag to pan</div>
          <div ref={mapRef} style={{ width: '100%', height: '75vh', minHeight: '500px' }} />
        </div>

        <div className="fade-up d3">
          <h2 style={{
            fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--gold-dim)', borderBottom: '1px solid var(--border)',
            paddingBottom: '0.5rem', marginBottom: '1.25rem',
          }}>
            Nations of Alatrya
          </h2>
          <div className="nation-grid">
            {NATIONS.map(nation => (
              <Link key={nation.slug} href={`/lore/nations/${nation.slug}`}>
                <div className="nation-item">
                  <div className="nation-name">{nation.name}</div>
                  <div className="nation-desc">{nation.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
