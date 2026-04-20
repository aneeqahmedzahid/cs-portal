import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, eventsData] = await Promise.all([
          api.getNews(),
          api.getEvents()
        ]);
        setNews(newsData.slice(0, 6)); // limit to 6
        setEvents(eventsData.slice(0, 6));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const portals = [
    {
      title: "CS Department Official",
      desc: "Visit the official webpage of the Department of Computer Science.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      ),
      link: "https://www.cuiatd.edu.pk/computer-science/"
    },
    {
      title: "Student Portal",
      desc: "Access your academics, courses, and fee details (SIS).",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
      ),
      link: "https://sis.cuiatd.edu.pk/"
    },
    {
      title: "Faculty Portal",
      desc: "Login to CUOnline for attendance, grading, and resources.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
      ),
      link: "https://cuonline.cuiatd.edu.pk/"
    },
    {
      title: "Internship Portal",
      desc: "Find and apply for the latest internship opportunities.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      ),
      link: "https://csinternships.cuiatd.edu.pk/"
    },
    {
      title: "Alumni Portal",
      desc: "Connect with the extensive COMSATS alumni network.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
      ),
      link: "https://ww5.comsats.edu.pk/alumni/"
    },
    {
      title: "University Main Page",
      desc: "Navigate to the official CUI Abbottabad campus website.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
      ),
      link: "https://cuiatd.edu.pk/"
    }
  ];

  return (
    <main className="min-h-screen font-sans selection:bg-comsats-blue selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#hero" className="flex items-center group">
            <img src="https://latdncjdcwtmtehhmazi.supabase.co/storage/v1/object/public/COMSATS%20CS%20PORTAL%20ASSETS/CSPORTALLOGO.png" alt="COMSATS Logo" className="h-24 w-auto mix-blend-multiply group-hover:scale-105 transition-transform object-contain" />
          </a>

          <div className="hidden md:flex gap-8 items-center font-medium text-sm tracking-wide">
            <a href="#hero" className="text-slate-600 hover:text-comsats-blue transition-colors">Home</a>
            <a href="#news-events" className="text-slate-600 hover:text-comsats-blue transition-colors">News & Events</a>
            <a href="#portals" className="text-slate-600 hover:text-comsats-blue transition-colors">Portals</a>
            <a href="#newsletter" className="px-4 py-2 border border-slate-300 text-slate-600 rounded-full hover:border-comsats-blue hover:text-comsats-blue transition-all text-xs">Subscribe</a>
            <Link to="/admin/login" className="px-5 py-2.5 bg-comsats-blue text-white rounded-full hover:bg-comsats-blue-dark hover:shadow-lg hover:shadow-comsats-blue/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Admin
            </Link>
          </div>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl py-4 px-6 flex flex-col gap-4">
            <a href="#hero" className="font-medium text-slate-800" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#news-events" className="font-medium text-slate-800" onClick={() => setIsMenuOpen(false)}>News & Events</a>
            <a href="#portals" className="font-medium text-slate-800" onClick={() => setIsMenuOpen(false)}>Portals</a>
            <a href="#newsletter" className="font-medium text-comsats-blue" onClick={() => setIsMenuOpen(false)}>Subscribe</a>
            <Link to="/admin/login" className="font-medium text-slate-500 text-sm flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Admin Login
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://latdncjdcwtmtehhmazi.supabase.co/storage/v1/object/public/COMSATS%20CS%20PORTAL%20ASSETS/481081607_1154567749697495_3877917703510462722_n.jpg"
            alt="Campus Background"
            className="w-full h-full object-cover object-center scale-105 animate-pulse-slow origin-center"
          />
          {/* Blue Gradient Overlay for a modern look */}
          <div className="absolute inset-0 bg-gradient-to-br from-comsats-blue-dark/95 via-comsats-blue/90 to-slate-900/90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
          <div className="max-w-4xl">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-blue-300/30 bg-blue-500/10 backdrop-blur-md text-blue-100 font-medium text-sm tracking-wider uppercase">
              COMSATS University Islamabad, Abbottabad
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tighter leading-[1.05] mb-8 text-balance drop-shadow-2xl">
              Department of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">Computer Science</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/90 font-light max-w-2xl leading-relaxed mb-10 text-balance">
              Welcome to the central hub. Access all your academic, professional, and departmental portals in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#news-events" className="px-8 py-4 bg-white text-comsats-blue font-bold rounded-full hover:bg-blue-50 hover:scale-105 transition-all shadow-xl shadow-white/10 flex items-center gap-2">
                Explore News & Portals
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* News & Events Section (Moved to be before portals) */}
      <section id="news-events" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">Latest News & Events</h2>
            <div className="w-24 h-1.5 bg-comsats-blue mx-auto rounded-full"></div>
          </div>

          {/* News */}
          {news.length > 0 && (
            <div className="mb-20">
              <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 bg-blue-50 text-comsats-blue rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                </span>
                News
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map(item => (
                  <Link to={`/news/${item.id}`} key={item.id} className="group bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-[0_8px_30px_rgb(31,92,169,0.12)] hover:border-comsats-blue/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />}
                    <div className="p-6">
                      <div className="text-xs text-comsats-blue font-semibold tracking-wider uppercase mb-2">{fmt(item.created_at)} &middot; {item.author}</div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2 tracking-tight group-hover:text-comsats-blue transition-colors">{item.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{item.content}</p>
                      <span className="mt-4 inline-flex items-center text-comsats-blue text-sm font-semibold gap-1">Read more <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Events */}
          {events.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 bg-blue-50 text-comsats-blue rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </span>
                Upcoming Events
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map(item => (
                  <Link to={`/events/${item.id}`} key={item.id} className="group flex gap-5 bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-[0_8px_30px_rgb(31,92,169,0.12)] hover:border-comsats-blue/20 transition-all duration-300 cursor-pointer">
                    <div className="shrink-0 w-16 h-16 bg-comsats-blue rounded-2xl flex flex-col items-center justify-center text-white">
                      <span className="text-xs font-semibold uppercase leading-none">{new Date(item.event_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-2xl font-bold leading-none mt-0.5">{new Date(item.event_date).getDate()}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-comsats-blue transition-colors">{item.title}</h4>
                      <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {item.location}
                      </p>
                      <p className="text-slate-600 text-sm mt-2 line-clamp-2">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {news.length === 0 && events.length === 0 && (
            <p className="text-center text-slate-400 text-lg py-10">No news or events posted yet. Check back soon!</p>
          )}
        </div>
      </section>

      {/* Portals Section using Material UI */}
      <section 
        id="portals" 
        className="py-32 relative overflow-hidden" 
        style={{
          backgroundColor: '#1f5ca9',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='100' viewBox='0 0 60 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M30 100L0 85v-30l30-15 30 15v30zM15 76.34L30 85l15-8.66V59.34L30 50.68 15 59.34zM0 35l30-15 30 15v30l-30 15-30-15zM15 26.34L30 35l15-8.66V9.34L30 .68 15 9.34z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full filter blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-400/20 rounded-full filter blur-[120px] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <Typography variant="h2" component="h2" sx={{ fontWeight: 'bold', color: 'white', mb: 3, fontSize: { xs: '2.25rem', md: '3.75rem' } }}>
              Quick Access Portals
            </Typography>
            <div className="w-24 h-1.5 bg-teal-400 mx-auto rounded-full"></div>
          </div>

          <Grid container spacing={4}>
            {portals.map((portal, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <a href={portal.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      borderRadius: '24px', 
                      boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '120px',
                        height: '120px',
                        background: 'radial-gradient(circle at top right, rgba(31,92,169,0.15) 0%, transparent 70%)',
                        transition: 'all 0.5s ease',
                        transform: 'scale(0.8)',
                        transformOrigin: 'top right',
                        opacity: 0,
                        zIndex: 0,
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '120px',
                        height: '120px',
                        background: 'radial-gradient(circle at bottom left, rgba(20,184,166,0.15) 0%, transparent 70%)',
                        transition: 'all 0.5s ease',
                        transform: 'scale(0.8)',
                        transformOrigin: 'bottom left',
                        opacity: 0,
                        zIndex: 0,
                      },
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        borderColor: 'rgba(31,92,169,0.3)',
                      },
                      '&:hover::before': {
                        transform: 'scale(1.5)',
                        opacity: 1,
                      },
                      '&:hover::after': {
                        transform: 'scale(1.5)',
                        opacity: 1,
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
                      <Box 
                        sx={{ 
                          width: 64, 
                          height: 64, 
                          bgcolor: '#eff6ff', 
                          color: '#1f5ca9', 
                          borderRadius: '16px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          mb: 3,
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          '.MuiCard-root:hover &': {
                            bgcolor: '#1f5ca9',
                            color: 'white',
                            transform: 'scale(1.1) rotate(5deg)',
                          }
                        }}
                      >
                        {portal.icon}
                      </Box>
                      <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: '#0f172a', mb: 1.5, transition: 'color 0.3s ease', '.MuiCard-root:hover &': { color: '#1f5ca9' } }}>
                        {portal.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7, flexGrow: 1 }}>
                        {portal.desc}
                      </Typography>
                      <Box 
                        sx={{ 
                          mt: 3, 
                          display: 'flex', 
                          alignItems: 'center', 
                          color: '#1f5ca9', 
                          fontWeight: 600, 
                          fontSize: '0.875rem', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px',
                          transition: 'all 0.3s ease',
                          transformOrigin: 'left',
                          '.MuiCard-root:hover &': {
                            color: '#14b8a6', // teal color on hover
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        Open Portal
                        <svg className="w-4 h-4 ml-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ '.MuiCard-root:hover &': { transform: 'translateX(4px)' } }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Box>
                    </CardContent>
                  </Card>
                </a>
              </Grid>
            ))}
          </Grid>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-32 relative overflow-hidden bg-slate-900">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-60"
        >
          <source src="https://latdncjdcwtmtehhmazi.supabase.co/storage/v1/object/public/COMSATS%20CS%20PORTAL%20ASSETS/istockphoto-1459585081-640_adpp_is%20(1).mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-900/50 mix-blend-multiply"></div>

        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-comsats-blue rounded-full mix-blend-multiply filter blur-[128px] opacity-30 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-12 md:p-16 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">Stay Connected</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
              Subscribe to the official CS Department newsletter to get the latest updates straight to your inbox.
            </p>

            <form method="post" action="https://www.cuiatd.edu.pk/wp-admin/admin-ajax.php?action=tnp&amp;na=s" className="max-w-xl mx-auto flex flex-col gap-4">
              <input type="hidden" name="nlang" value="" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="nn"
                  placeholder="Your Name"
                  required
                  className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-comsats-blue focus:border-transparent transition-all"
                />
                <input
                  type="email"
                  name="ne"
                  placeholder="Your Email"
                  required
                  className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-comsats-blue focus:border-transparent transition-all"
                />
              </div>

              <label className="flex items-center justify-center gap-3 text-sm text-slate-400 mt-2 cursor-pointer group">
                <input type="checkbox" name="ny" required className="w-5 h-5 rounded border-slate-600 text-comsats-blue focus:ring-comsats-blue bg-white/5" />
                <span className="group-hover:text-slate-300 transition-colors">I accept the privacy policy</span>
              </label>

              <button type="submit" className="mt-4 w-full py-4 bg-comsats-blue hover:bg-comsats-blue-light text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-comsats-blue/25 tracking-wide text-lg">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <img src="/footerlogo.png" alt="COMSATS Logo" className="h-32 mb-6 object-contain" />
              <p className="text-slate-400 leading-relaxed font-light">
                Department of Computer Science<br />
                COMSATS University Islamabad,<br />
                Abbottabad Campus
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#hero" className="text-slate-400 hover:text-comsats-blue transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Home</a></li>
                <li><a href="#portals" className="text-slate-400 hover:text-comsats-blue transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Portals</a></li>
                <li><a href="#newsletter" className="text-slate-400 hover:text-comsats-blue transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Newsletter</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Contact Us</h4>
              <ul className="space-y-4 text-slate-400 font-light">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  University Road, Tobe Camp, Abbottabad, Pakistan
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <a href="mailto:info@cuiatd.edu.pk" className="hover:text-white transition-colors">info@cuiatd.edu.pk</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm font-light">
            <p>&copy; {new Date().getFullYear()} COMSATS University Islamabad, Abbottabad Campus. All rights reserved.</p>
            <p className="mt-3 text-slate-300 text-sm tracking-wide">
              Developed by <a href="https://pk.linkedin.com/in/aneeqahmedzahid" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Aneeq Ahmed Zahid</a> (SP24-BSE-105), CUI Abbottabad
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
