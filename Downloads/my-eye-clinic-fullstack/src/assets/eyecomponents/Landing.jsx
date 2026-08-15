/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Eye, Activity, Clock, Award, User, Calendar, Phone, Mail, MapPin, CheckCircle, Star, ArrowRight, Play, ChevronLeft, ChevronRight, X, ShoppingCart, Minus, Plus, CreditCard, MessageCircle, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api as apiClient } from '../../api/client';

const Counter = ({ end }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    const duration = 1200;
    let frame;
    
    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(end * progress));
      if (progress < 1) {
        frame = requestAnimationFrame(updateCount);
      }
    };
    
    frame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(frame);
  }, [end]);
  
  return <span>{count.toLocaleString()}</span>;
};

const AnimatedSection = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div ref={sectionRef} className={`${className} ${isVisible ? 'animate-slide-in' : 'opacity-0'}`}>
      {children}
    </div>
  );
};

const Toast = ({ show, message, type = 'success', onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#009688';
  const icon = type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />;

  return (
    <div className="position-fixed top-0 start-50 translate-middle-x mt-5" style={{ zIndex: 10000, animation: 'slideDown 0.3s ease' }}>
      <div className="d-flex align-items-center gap-3 px-4 py-3 rounded-4 shadow-lg text-white" style={{ backgroundColor: bgColor, minWidth: '300px' }}>
        {icon}
        <span className="fw-semibold">{message}</span>
        <button onClick={onClose} className="btn-close btn-close-white ms-auto" style={{ fontSize: '0.7rem' }}></button>
      </div>
    </div>
  );
};

const ConfirmDialog = ({ show, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "info" }) => {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={48} color="#28a745" />;
      case 'warning':
        return <AlertCircle size={48} color="#ffc107" />;
      case 'error':
        return <AlertCircle size={48} color="#dc3545" />;
      default:
        return <AlertCircle size={48} color="#009688" />;
    }
  };

  const bgColor = type === 'success' ? '#e8f5e9' : type === 'warning' ? '#fff3e0' : type === 'error' ? '#ffebee' : '#e0f2f1';
  const btnColor = type === 'error' || type === 'warning' ? '#dc3545' : '#009688';

  return (
    <>
      <div className="modal-backdrop-custom" onClick={onCancel}></div>
      
      <div className="position-fixed top-50 start-50 translate-middle" style={{ zIndex: 10000, width: '90vw', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="bg-white rounded-4 shadow-lg position-relative" style={{ padding: '2rem' }}>
          <button
            onClick={onCancel}
            className="btn rounded-circle hover-scale-close d-flex align-items-center justify-content-center position-absolute p-0"
            style={{ 
              top: '10px', 
              right: '10px', 
              width: '40px', 
              height: '40px', 
              zIndex: 10001,
              backgroundColor: '#f8f9fa',
              border: '2px solid #dee2e6',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              color: '#495057'
            }}
            aria-label="Close dialog"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="text-center">
            <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle p-3" style={{ backgroundColor: bgColor }}>
              {getIcon()}
            </div>

            <h4 className="fw-bold mb-3 text-dark">{title}</h4>

            <p className="text-muted mb-4" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{message}</p>

            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button
                onClick={onCancel}
                className="btn btn-outline-secondary px-5 py-2 fw-semibold"
                style={{ borderRadius: '25px', borderWidth: '2px', minWidth: '120px' }}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="btn text-white px-5 py-2 fw-semibold"
                style={{ 
                  backgroundColor: btnColor,
                  borderRadius: '25px',
                  minWidth: '120px',
                  boxShadow: '0 4px 12px rgba(0,150,136,0.3)'
                }}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SectionSlider = ({ items, renderItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, items.length - itemsPerView);

  const next = () => setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  const prev = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

  return (
    <div className="position-relative">
      {currentIndex > 0 && (
        <button 
          onClick={prev}
          className="btn btn-light rounded-circle position-absolute start-0 top-50 translate-middle-y hover-scale-close shadow-lg" 
          style={{ width: '50px', height: '50px', zIndex: 10, left: '-25px' }}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      
      <div className="overflow-hidden">
        <div 
          className="d-flex transition-transform" 
          style={{ 
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {items.map((item, index) => (
            <div key={index} style={{ minWidth: `${100 / itemsPerView}%`, padding: '0 10px' }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      {currentIndex < maxIndex && (
        <button 
          onClick={next}
          className="btn btn-light rounded-circle position-absolute end-0 top-50 translate-middle-y hover-scale-close shadow-lg" 
          style={{ width: '50px', height: '50px', zIndex: 10, right: '-25px' }}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

const EyeCareLanding = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', date: '', service: '', message: '', time: '', doctor: ''
  });
  
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const today = new Date().toISOString().split('T')[0];

  // Load jsPDF dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Generate PDF appointment function
  const generatePDF = async () => {
    try {
      if (typeof window === 'undefined' || !window.jspdf) {
        throw new Error('jsPDF library not loaded');
      }
      // Create a new jsPDF instance
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Add logo (convert image to base64)
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop';
      
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = logoImg.width;
      canvas.height = logoImg.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(logoImg, 0, 0);
      const logoData = canvas.toDataURL('image/jpeg');
      
      // Add logo
      doc.addImage(logoData, 'JPEG', 85, 10, 40, 40);
      
      // Company name
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 77, 64);
      doc.text('EyeCare', 105, 58, { align: 'center' });
      
      // Tagline
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 121, 107);
      doc.text('Professional Eye Care Services', 105, 65, { align: 'center' });
      
      // Line separator
      doc.setDrawColor(0, 150, 136);
      doc.setLineWidth(1);
      doc.line(20, 72, 190, 72);
      
      // Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 77, 64);
      doc.text('Appointment Confirmation', 105, 85, { align: 'center' });
      
      // Booking ID box
      doc.setFillColor(224, 247, 245);
      doc.rect(20, 95, 170, 20, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 77, 64);
      doc.text('BOOKING ID', 105, 103, { align: 'center' });
      doc.setFontSize(16);
      doc.setTextColor(0, 150, 136);
      doc.text(bookingId, 105, 111, { align: 'center' });
      
      // Patient details
      let yPos = 130;
      const leftCol = 25;
      const rightCol = 110;
      
      // Helper function to add detail box
      const addDetailBox = (x, y, label, value) => {
        doc.setDrawColor(224, 247, 245);
        doc.setLineWidth(0.5);
        doc.roundedRect(x, y, 80, 15, 2, 2, 'S');
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 121, 107);
        doc.text(label.toUpperCase(), x + 3, y + 5);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 77, 64);
        doc.text(value, x + 3, y + 11);
      };
      
      // Add all details in grid
      addDetailBox(leftCol, yPos, 'Patient Name', formData.name);
      addDetailBox(rightCol, yPos, 'Phone Number', formData.phone);
      
      yPos += 20;
      addDetailBox(leftCol, yPos, 'Email Address', formData.email.length > 28 ? formData.email.substring(0, 25) + '...' : formData.email);
      addDetailBox(rightCol, yPos, 'Appointment Date', new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
      
      yPos += 20;
      addDetailBox(leftCol, yPos, 'Appointment Time', formData.time);
      addDetailBox(rightCol, yPos, 'Doctor', formData.doctor.split(' - ')[0]);
      
      yPos += 20;
      addDetailBox(leftCol, yPos, 'Service Type', formData.service.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
      addDetailBox(rightCol, yPos, 'Booking Date', new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
      
      // Additional notes if any
      if (formData.message) {
        yPos += 25;
        doc.setDrawColor(224, 247, 245);
        doc.setLineWidth(0.5);
        doc.roundedRect(leftCol, yPos, 165, 20, 2, 2, 'S');
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 121, 107);
        doc.text('ADDITIONAL NOTES', leftCol + 3, yPos + 5);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 77, 64);
        const splitMessage = doc.splitTextToSize(formData.message, 155);
        doc.text(splitMessage, leftCol + 3, yPos + 11);
        yPos += 25;
      } else {
        yPos += 5;
      }
      
      // Important Information
      yPos += 15;
      doc.setFillColor(255, 243, 224);
      doc.setDrawColor(255, 152, 0);
      doc.setLineWidth(2);
      doc.rect(leftCol, yPos, 165, 35, 'FD');
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(245, 124, 0);
      doc.text('IMPORTANT INFORMATION', leftCol + 3, yPos + 6);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      const notes = [
        '• Please arrive 15 minutes before your appointment time',
        '• Bring a valid ID and insurance card (if applicable)',
        '• Bring your current eyeglasses or contact lenses',
        '• List of current medications'
      ];
      notes.forEach((note, index) => {
        doc.text(note, leftCol + 5, yPos + 13 + (index * 5));
      });
      
      // Footer
      yPos = 265;
      doc.setDrawColor(224, 247, 245);
      doc.setLineWidth(0.5);
      doc.line(20, yPos, 190, yPos);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 77, 64);
      doc.text('Contact Us', 105, yPos + 7, { align: 'center' });
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 121, 107);
      doc.text('📞 +1 (234) 567-8900    📧 info@eyecare.com    📍 123 Eye Street, Vision City, VC 12345', 105, yPos + 13, { align: 'center' });
      
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(`© ${new Date().getFullYear()} EyeCare. All rights reserved.`, 105, yPos + 20, { align: 'center' });
      
      // Save PDF
      doc.save(`EyeCare-Appointment-${bookingId}.pdf`);
      showToast('PDF downloaded successfully!', 'success');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Error generating PDF. Please try again.', 'error');
    }
  };

  // Print appointment function
  const printAppointment = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Appointment Confirmation - ${bookingId}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Arial', sans-serif; 
            padding: 40px;
            background: #fff;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #009688;
            padding-bottom: 20px;
          }
          .logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin-bottom: 15px;
          }
          .company-name {
            font-size: 32px;
            font-weight: bold;
            color: #004d40;
            margin-bottom: 5px;
          }
          .tagline {
            color: #00796b;
            font-size: 14px;
          }
          .content {
            max-width: 600px;
            margin: 0 auto;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #004d40;
            margin-bottom: 30px;
            text-align: center;
          }
          .booking-id {
            background: #e0f7f5;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
          }
          .booking-id strong {
            color: #004d40;
            font-size: 14px;
          }
          .booking-id span {
            color: #009688;
            font-size: 20px;
            font-weight: bold;
            display: block;
            margin-top: 5px;
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .detail-item {
            border: 2px solid #e0f7f5;
            padding: 15px;
            border-radius: 8px;
          }
          .detail-label {
            color: #00796b;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 8px;
          }
          .detail-value {
            color: #004d40;
            font-size: 16px;
            font-weight: bold;
          }
          .message-box {
            border: 2px solid #e0f7f5;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0f7f5;
            text-align: center;
          }
          .contact-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 15px;
            flex-wrap: wrap;
          }
          .contact-item {
            color: #00796b;
            font-size: 13px;
          }
          .important-note {
            background: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .important-note strong {
            color: #f57c00;
            display: block;
            margin-bottom: 5px;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop" alt="EyeCare Logo" class="logo">
          <div class="company-name">EyeCare</div>
          <div class="tagline">Professional Eye Care Services</div>
        </div>
        
        <div class="content">
          <div class="title">Appointment Confirmation</div>
          
          <div class="booking-id">
            <strong>BOOKING ID</strong>
            <span>${bookingId}</span>
          </div>
          
          <div class="details-grid">
            <div class="detail-item">
              <div class="detail-label">Patient Name</div>
              <div class="detail-value">${formData.name}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Phone Number</div>
              <div class="detail-value">${formData.phone}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Email Address</div>
              <div class="detail-value">${formData.email}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Appointment Date</div>
              <div class="detail-value">${new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Appointment Time</div>
              <div class="detail-value">${formData.time}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Doctor</div>
              <div class="detail-value">${formData.doctor}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Service Type</div>
              <div class="detail-value">${formData.service.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Booking Date</div>
              <div class="detail-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
          
          ${formData.message ? `
          <div class="message-box">
            <div class="detail-label">Additional Notes</div>
            <div style="color: #004d40; margin-top: 8px;">${formData.message}</div>
          </div>
          ` : ''}
          
          <div class="important-note">
            <strong>Important Information:</strong>
            <ul style="margin: 10px 0 0 20px; color: #666;">
              <li>Please arrive 15 minutes before your appointment time</li>
              <li>Bring a valid ID and insurance card (if applicable)</li>
              <li>Bring your current eyeglasses or contact lenses</li>
              <li>List of current medications</li>
            </ul>
          </div>
          
          <div class="footer">
            <div style="color: #004d40; font-weight: bold; margin-bottom: 10px;">
              Contact Us
            </div>
            <div class="contact-info">
              <div class="contact-item">📞 +1 (234) 567-8900</div>
              <div class="contact-item">📧 info@eyecare.com</div>
              <div class="contact-item">📍 123 Eye Street, Vision City, VC 12345</div>
            </div>
            <div style="margin-top: 20px; color: #999; font-size: 12px;">
              © ${new Date().getFullYear()} EyeCare. All rights reserved.
            </div>
          </div>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print()" style="background: #009688; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 16px; cursor: pointer; font-weight: bold;">
            Print Appointment
          </button>
          <button onclick="window.close()" style="background: #666; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 16px; cursor: pointer; margin-left: 10px; font-weight: bold;">
            Close
          </button>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Available times now come from the backend, scoped to date + doctor
  const defaultTimes = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];
  const [availableTimesFromApi, setAvailableTimesFromApi] = useState(defaultTimes);

  useEffect(() => {
    if (!formData.date || !formData.doctor) {
      setAvailableTimesFromApi(defaultTimes);
      return;
    }
    let cancelled = false;
    apiClient.getAvailability(formData.date, formData.doctor)
      .then(times => { if (!cancelled) setAvailableTimesFromApi(times); })
      .catch(() => { if (!cancelled) setAvailableTimesFromApi(defaultTimes); });
    return () => { cancelled = true; };
  }, [formData.date, formData.doctor]);

  // Get available times for selected date and doctor
  const getAvailableTimes = () => availableTimesFromApi;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const showConfirmDialog = (config) => {
    setDialogConfig(config);
    setShowDialog(true);
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    showConfirmDialog({
      title: "Confirm Appointment",
      message: `Are you sure you want to book this appointment with ${formData.doctor} on ${formData.date} at ${formData.time}?`,
      type: "info",
      confirmText: "Book Now",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          const appointment = await apiClient.bookAppointment(formData);
          setBookingId(appointment.bookingId);
          setBookingSubmitted(true);
          setShowDialog(false);
          showToast('Appointment booked successfully!', 'success');

          setTimeout(() => {
            setBookingSubmitted(false);
            setBookingId('');
            setFormData({ name: '', email: '', phone: '', date: '', service: '', message: '', time: '', doctor: '' });
          }, 5000);
        } catch (err) {
          setShowDialog(false);
          showToast(err.message || 'This time slot is no longer available. Please select another time.', 'error');
        }
      },
      onCancel: () => setShowDialog(false)
    });
  }, [formData]);

  const handleCheckoutSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      await apiClient.placeOrder({
        name: formData.name || 'Guest',
        email: formData.email || 'guest@example.com',
        items: cart.map(({ name, price, quantity }) => ({ name, price, quantity })),
        total: parseFloat(getCartTotal())
      });
      showToast('Payment successful! Thank you for your purchase.', 'success');
      setCart([]);
      setShowCheckout(false);
    } catch (err) {
      showToast(err.message || 'Checkout failed. Please try again.', 'error');
    }
  }, [cart, formData]);

  const testimonials = useMemo(() => [
    { name: "Sarah Johnson", role: "Cataract Surgery Patient", text: "The care and attention I received during my cataract surgery was exceptional. The entire team made me feel comfortable and well-informed throughout the process." },
    { name: "Michael Chen", role: "LASIK Patient", text: "Life-changing experience! The LASIK procedure was quick and painless. My vision is now perfect, and I couldn't be happier with the results." },
    { name: "Emma Williams", role: "Regular Patient", text: "I've been coming here for years. The doctors are knowledgeable, the staff is friendly, and they always have the latest technology." }
  ], []);

  const openWhatsApp = useCallback(() => {
    showConfirmDialog({
      title: "Open WhatsApp",
      message: "You will be redirected to WhatsApp. Continue?",
      type: "info",
      confirmText: "Continue",
      cancelText: "Cancel",
      onConfirm: () => {
        window.open(`https://wa.me/1234567890?text=${encodeURIComponent("Hello! I'm interested in your eye care services.")}`, '_blank');
        setShowDialog(false);
        showToast('Opening WhatsApp...', 'success');
      },
      onCancel: () => setShowDialog(false)
    });
  }, []);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(item => item.name === product.name);
      if (existing) {
        return prev.map(item => 
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} added to cart!`, 'success');
  }, []);

  const removeFromCart = useCallback((productName) => {
    showConfirmDialog({
      title: "Remove Item",
      message: "Are you sure you want to remove this item from your cart?",
      type: "warning",
      confirmText: "Remove",
      cancelText: "Cancel",
      onConfirm: () => {
        setCart(prev => prev.filter(item => item.name !== productName));
        setShowDialog(false);
        showToast('Item removed from cart', 'success');
      },
      onCancel: () => setShowDialog(false)
    });
  }, []);

  const updateQuantity = useCallback((productName, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productName);
    } else {
      setCart(prev => prev.map(item => 
        item.name === productName ? { ...item, quantity: newQuantity } : item
      ));
    }
  }, [removeFromCart]);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  }, [cart]);

  const [doctors, setDoctors] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    apiClient.getDoctors().then(setDoctors).catch(() => {});
    apiClient.getServices().then(setServicesData).catch(() => {});
    apiClient.getProducts().then(setProductsData).catch(() => {});
  }, []);

  // Icons aren't stored in the backend (they're managed here), matched by service title
  const serviceIcons = useMemo(() => ({
    "Surgical Procedures": <Activity size={48} />,
    "Vision Consultation": <Eye size={48} />,
    "Optical Experience": <Award size={48} />,
    "Emergency Care": <Clock size={48} />,
    "Diagnostics & Testing": <Activity size={48} />,
    "Retina Surgery": <Eye size={48} />
  }), []);

  const services = useMemo(
    () => servicesData.map(item => ({ ...item, icon: serviceIcons[item.title] || <Eye size={48} />, color: '#f8f9fa' })),
    [servicesData, serviceIcons]
  );

  const products = productsData;
  const footerServices = services.length ? services.slice(0, 6) : [
    { id: 'surgical-procedures', title: 'Surgical Procedures' },
    { id: 'vision-consultation', title: 'Vision Consultation' },
    { id: 'optical-experience', title: 'Optical Experience' },
    { id: 'emergency-care', title: 'Emergency Care' },
    { id: 'diagnostics-testing', title: 'Diagnostics & Testing' },
    { id: 'retina-surgery', title: 'Retina Surgery' }
  ];

  const stats = useMemo(() => [
    { num: 1280, label: "Happy Patients", icon: <User size={40} />, color: '#009688' },
    { num: 1480, label: "Procedures", icon: <Activity size={40} />, color: '#00796b' },
    { num: 2080, label: "Expert Doctors", icon: <Award size={40} />, color: '#009688' },
    { num: 1102, label: "Awards Won", icon: <Star size={40} />, color: '#00796b' }
  ], []);

  const handleNewsletterSubscribe = useCallback(async (e) => {
    e.preventDefault();
    const email = e.target.elements[0]?.value;
    try {
      await apiClient.sendMessage({ email, subject: 'Newsletter Signup', message: 'Subscribed via footer newsletter form.' });
      showToast('Subscribed successfully! Check your email for tips.', 'success');
      e.target.reset();
    } catch (err) {
      showToast(err.message || 'Subscription failed. Please try again.', 'error');
    }
  }, []);

  return (
    <div className="bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      
      <style dangerouslySetInnerHTML={{__html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -100%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .animate-slide-in {
          animation: slideInLeft 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .hover-lift {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }
        
        .hover-lift::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0, 150, 136, 0.1), rgba(0, 121, 107, 0.1));
          opacity: 0;
          transition: opacity 0.4s ease;
          border-radius: inherit;
          z-index: -1;
        }
        
        .hover-lift:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 150, 136, 0.25) !important;
        }
        
        .hover-lift:hover::before {
          opacity: 1;
        }
        
        .hover-scale {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .hover-scale:hover {
          transform: scale(1.15) rotate(5deg);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .hover-scale-close {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .hover-scale-close:hover {
          transform: scale(1.1) rotate(90deg);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          background-color: #f8f9fa !important;
        }
        
        .img-zoom {
          overflow: hidden;
          position: relative;
        }
        
        .img-zoom::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0, 150, 136, 0.3), rgba(0, 121, 107, 0.3));
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        
        .img-zoom img {
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .img-zoom:hover img {
          transform: scale(1.2) rotate(2deg);
        }
        
        .img-zoom:hover::after {
          opacity: 1;
        }
        
        .btn-3d {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 6px 20px rgba(0,150,136,0.3);
          position: relative;
          overflow: hidden;
        }
        
        .btn-3d::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .btn-3d:hover::before {
          width: 300px;
          height: 300px;
        }
        
        .btn-3d:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 12px 35px rgba(0,150,136,0.5);
        }
        
        .btn-3d:active{
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 6px 20px rgba(0,150,136,0.4);
        }
        
        .modal-backdrop-custom {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px);
          z-index: 9998;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .social-icon {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        
        .social-icon::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: translate(-50%, -50%);
          transition: width 0.5s, height 0.5s;
        }
        
        .social-icon:hover::after {
          width: 100px;
          height: 100px;
        }
        
        .social-icon:hover {
          transform: translateY(-8px) scale(1.2) rotate(360deg);
          box-shadow: 0 8px 25px rgba(0,0,0,0.4);
        }
        
        .social-icon-footer {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        
        .social-icon-footer::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.5s, height 0.5s;
        }
        
        .social-icon-footer:hover::after {
          width: 100px;
          height: 100px;
        }
        
        .social-icon-footer:hover {
          transform: translateY(-5px) scale(1.15) rotate(360deg);
          box-shadow: 0 8px 20px rgba(255,255,255,0.3);
        }
        
        .footer-link {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          position: relative;
        }
        
        .footer-link:hover {
          color: #fff !important;
          transform: translateX(5px);
        }
        
        .footer-link:hover::after {
          width: 100%;
        }
        
        .card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 2px solid transparent;
        }
        
        .card:hover {
          box-shadow: 0 20px 60px rgba(0,0,0,0.2) !important;
          border-color: rgba(0, 150, 136, 0.3);
        }
        
        .nav-link {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          width: 0;
          height: 3px;
          background: linear-gradient(135deg, #009688, #00796b);
          transition: all 0.3s ease;
          transform: translateX(-50%);
          border-radius: 2px;
        }
        
        .nav-link:hover::after {
          width: 80%;
        }
        
        .nav-link:hover {
          color: #009688 !important;
          transform: translateY(-2px);
        }
        
        .badge {
          transition: all 0.3s ease;
        }
        
        .badge:hover {
          transform: scale(1.1);
          box-shadow: 0 5px 15px rgba(0, 150, 136, 0.3);
        }
        
        @media (max-width: 768px) {
          .display-1 { font-size: 2.5rem !important; }
          .display-3 { font-size: 2rem !important; }
          .display-4 { font-size: 1.8rem !important; }
        }
        
        .scroll-smooth {
          scroll-behavior: smooth;
        }
        
        ::-webkit-scrollbar {
          width: 12px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #009688, #00796b);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #00796b, #004d40);
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #009688;
          box-shadow: 0 0 0 0.2rem rgba(0, 150, 136, 0.25);
        }
        
        .btn-outline-secondary {
          transition: all 0.3s ease;
        }
        
        .btn-outline-secondary:hover {
          background: #009688 !important;
          border-color: #009688 !important;
          color: white !important;
          transform: translateY(-2px);
        }
        
        .map-container {
          height: 350px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          transition: all 0.4s ease;
        }
        
        .map-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 50px rgba(0,0,0,0.3);
        }
      `}} />

      {/* Toast Notification */}
      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog 
        show={showDialog}
        title={dialogConfig.title}
        message={dialogConfig.message}
        type={dialogConfig.type}
        confirmText={dialogConfig.confirmText}
        cancelText={dialogConfig.cancelText}
        onConfirm={dialogConfig.onConfirm}
        onCancel={dialogConfig.onCancel}
      />

      {/* Top Bar */}
      <div style={{ background: 'linear-gradient(135deg, #004d40, #00695c)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1050, padding: '10px 0' }}>
        <div className="container">
          <div className="row align-items-center text-white">
            <div className="col-md-6 d-none d-md-flex gap-3">
              <div className="d-flex align-items-center gap-2 hover-scale" style={{ cursor: 'pointer' }}>
                <Phone size={14} />
                <small>+1 (234) 567-8900</small>
              </div>
              <div className="d-flex align-items-center gap-2 hover-scale" style={{ cursor: 'pointer' }}>
                <Mail size={14} />
                <small>info@eyecare.com</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <button 
        onClick={openWhatsApp} 
        className="btn btn-success rounded-circle shadow-lg position-fixed hover-scale" 
        style={{ bottom: '30px', right: '30px', width: '60px', height: '60px', zIndex: 1000 }}
        aria-label="Contact via WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </button>

      {/* Cart Button */}
      <button 
        onClick={() => setShowCart(true)} 
        className="btn text-white rounded-circle shadow-lg position-fixed hover-scale" 
        style={{ bottom: '100px', right: '30px', width: '60px', height: '60px', backgroundColor: '#009688', zIndex: 1000 }}
        aria-label="View shopping cart"
        title="View Cart"
      >
        <ShoppingCart size={28} />
        {cart.length > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ animation: 'pulse 2s infinite' }}>
            {cart.length}
          </span>
        )}
      </button>

      {/* Navigation */}
      <nav className={`navbar navbar-expand-lg navbar-light sticky-top shadow-sm ${scrolled ? 'bg-white' : 'bg-light'}`} style={{ top: '38px', transition: 'all 0.3s' }}>
        <div className="container py-2">
          <a className="navbar-brand d-flex align-items-center hover-scale" href="#home">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop" 
              alt="EyeCare Logo" 
              className="me-2 rounded-circle" 
              style={{ width: '45px', height: '45px', objectFit: 'cover' }} 
            />
            <span className="fw-bold fs-4" style={{ color: '#004d40' }}>EyeCare</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {['Home', 'About', 'Services', 'Doctors', 'Shop', 'Contact'].map((item, i) => (
                <li key={i} className="nav-item">
                  <a className="nav-link px-3 fw-semibold" href={`#${item.toLowerCase()}`} style={{ color: '#004d40' }}>
                    {item}
                  </a>
                </li>
              ))}
              <li className="nav-item ms-2 d-flex gap-2">
                <Link to="/login" className="btn btn-outline-success px-3 py-2" style={{ borderRadius: '25px' }}>Login</Link>
                <Link to="/register" className="btn text-white px-3 py-2" style={{ backgroundColor: '#004d40', borderRadius: '25px' }}>Register</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={{ background: 'linear-gradient(135deg, #e0f7f5, #b2dfdb)', minHeight: '90vh', display: 'flex', alignItems: 'center', marginTop: '38px', padding: '80px 0' }}>
        <div className="container">
          <div className="row align-items-center">
            <AnimatedSection className="col-lg-6 mb-4 mb-lg-0">
              <span className="badge px-4 py-2 mb-3" style={{ backgroundColor: '#fff', color: '#009688', borderRadius: '20px', fontWeight: '600' }}>
                <Star size={16} fill="#009688" /> Professional Eye Care
              </span>
              <h1 className="display-1 fw-bold mb-4" style={{ color: '#004d40', lineHeight: '1.2' }}>
                Best Care For <span style={{ color: '#009688' }}>Your Eyes</span>
              </h1>
              <p className="lead mb-4" style={{ fontSize: '1.3rem', color: '#00796b' }}>
                Professional eye care with cutting-edge technology and experienced specialists.
              </p>
              <div className="d-flex gap-3 mb-4 flex-wrap">
                <a href="#appointment" className="btn btn-lg text-white px-5 py-3 btn-3d" style={{ backgroundColor: '#009688', borderRadius: '30px' }}>
                  <Calendar size={20} /> Book Now
                </a>
                <a href="#services" className="btn btn-lg px-5 py-3 btn-3d" style={{ backgroundColor: '#fff', color: '#009688', borderRadius: '30px', border: '2px solid #009688' }}>
                  Our Services
                </a>
              </div>
              <div className="d-flex gap-4 flex-wrap">
                {[{ icon: <User size={30} />, num: 2080, label: 'Doctors' }, { icon: <Award size={30} />, num: 1102, label: 'Awards' }].map((stat, i) => (
                  <div key={i} className="d-flex align-items-center p-3 rounded-3 bg-white shadow-sm hover-lift">
                    <div className="rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', backgroundColor: '#009688', color: '#fff' }}>
                      {stat.icon}
                    </div>
                    <div>
                      <div className="fw-bold fs-4" style={{ color: '#004d40' }}>
                        <Counter end={stat.num} />+
                      </div>
                      <small className="text-muted">{stat.label}</small>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection className="col-lg-6">
              <div className="img-zoom rounded-4 overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=700&fit=crop" alt="Professional eye care consultation" className="img-fluid" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Doctors Section with Slider */}
      <section id="doctors" className="py-5 bg-light">
        <div className="container py-5">
          <AnimatedSection className="text-center mb-5">
            <span className="badge px-4 py-2 mb-3" style={{ backgroundColor: '#fff', color: '#009688', borderRadius: '20px' }}>
              Our Team
            </span>
            <h2 className="fw-bold display-3" style={{ color: '#004d40' }}>Expert Specialists</h2>
          </AnimatedSection>
          
          <div className="d-none d-lg-block">
            <SectionSlider 
              items={doctors}
              renderItem={(d, i) => (
                <div className="card border-0 shadow hover-lift" style={{ borderRadius: '20px', cursor: 'pointer' }}>
                  <div className="img-zoom" style={{ height: '400px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                    <img src={d.img} alt={d.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="card-body text-center p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    <h5 className="fw-bold mb-2">{d.name}</h5>
                    <p className="text-muted mb-3">{d.specialty}</p>
                    <div className="d-flex justify-content-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#ffc107" color="#ffc107" />)}
                    </div>
                    <button 
                      onClick={() => { setSelectedDoctor(d); setShowDoctorModal(true); }} 
                      className="btn text-white px-4 py-2 btn-3d w-100" 
                      style={{ backgroundColor: '#009688', borderRadius: '20px' }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              )}
            />
          </div>

          <div className="row g-4 d-lg-none">
            {doctors.map((d, i) => (
              <div key={i} className="col-md-6">
                <div className="card border-0 shadow hover-lift" style={{ borderRadius: '20px', cursor: 'pointer' }}>
                  <div className="img-zoom" style={{ height: '400px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                    <img src={d.img} alt={d.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="card-body text-center p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    <h5 className="fw-bold mb-2">{d.name}</h5>
                    <p className="text-muted mb-3">{d.specialty}</p>
                    <div className="d-flex justify-content-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#ffc107" color="#ffc107" />)}
                    </div>
                    <button 
                      onClick={() => { setSelectedDoctor(d); setShowDoctorModal(true); }} 
                      className="btn text-white px-4 py-2 btn-3d w-100" 
                      style={{ backgroundColor: '#009688', borderRadius: '20px' }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 text-white" style={{ background: 'linear-gradient(135deg, #00796b, #009688)' }}>
        <div className="container py-5">
          <div className="row text-center g-4">
            {stats.map((s, i) => (
              <AnimatedSection key={i} className="col-md-3 col-sm-6">
                <div className="p-4 rounded-3 hover-lift" style={{ backgroundColor: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                  <div className="mb-3">{s.icon}</div>
                  <h2 className="display-4 fw-bold mb-2">
                    <Counter end={s.num} />+
                  </h2>
                  <p className="mb-0 opacity-90">{s.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="py-5 bg-light">
        <div className="container py-5">
          <AnimatedSection className="text-center mb-5">
            <span className="badge px-4 py-2 mb-3" style={{ backgroundColor: '#fff', color: '#009688', borderRadius: '20px' }}>
              Our Products
            </span>
            <h2 className="fw-bold display-3" style={{ color: '#004d40' }}>Eye Care Products</h2>
          </AnimatedSection>
          <div className="row g-4">
            {products.map((p, i) => (
              <AnimatedSection key={i} className="col-lg-3 col-md-6">
                <div id={`product-${p.id}`} className="card border-0 shadow hover-lift h-100" style={{ borderRadius: '20px', cursor: 'pointer' }}>
                  <div className="img-zoom" style={{ height: '220px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                    <img src={p.img} alt={p.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="card-body text-center p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    <h6 className="fw-bold mb-3">{p.name}</h6>
                    <div className="mb-3">
                      <span className="text-muted text-decoration-line-through me-2">{p.oldPrice}</span>
                      <span className="fw-bold fs-4" style={{ color: '#009688' }}>{p.price}</span>
                    </div>
                    <div className="d-flex justify-content-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#ffc107" color="#ffc107" />)}
                      <span className="ms-1 small text-muted">({p.reviews})</span>
                    </div>
                    <button 
                      onClick={() => { setSelectedProduct(p); setShowProductModal(true); }} 
                      className="btn btn-outline-secondary w-100 mb-2"
                      style={{ borderRadius: '20px' }}
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => addToCart(p)} 
                      className="btn text-white px-4 py-2 btn-3d w-100" 
                      style={{ backgroundColor: '#009688', borderRadius: '20px' }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #004d40, #00695c)' }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <AnimatedSection className="col-lg-6 mb-4 mb-lg-0">
              <div className="img-zoom rounded-4 overflow-hidden shadow-lg position-relative">
                <img src="https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=600&h=500&fit=crop" alt="Patient testimonial video" className="img-fluid" />
                <div className="position-absolute top-50 start-50 translate-middle">
                  <button className="rounded-circle d-flex align-items-center justify-content-center bg-white hover-scale" style={{ width: '80px', height: '80px', border: 'none', cursor: 'pointer' }} aria-label="Play video">
                    <Play size={32} color="#009688" fill="#009688" />
                  </button>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection className="col-lg-6 text-white">
              <span className="badge px-4 py-2 mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '20px' }}>
                Testimonials
              </span>
              <h3 className="fw-bold mb-4 display-4">What Patients Say</h3>
              <div className="mb-4">
                <div className="d-flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="#ffc107" color="#ffc107" />)}
                </div>
                <p className="lead mb-4" style={{ fontSize: '1.3rem', fontStyle: 'italic' }}>
                  "{testimonials[currentTestimonial].text}"
                </p>
              </div>
              <div className="d-flex align-items-center justify-content-between p-4 rounded-3 hover-lift" style={{ backgroundColor: 'rgba(255,255,255,0.15)', cursor: 'pointer' }}>
                <div className="d-flex align-items-center">
                  <div className="rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: '#009688' }}>
                    <User size={30} />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">{testimonials[currentTestimonial].name}</h5>
                    <small className="opacity-75">{testimonials[currentTestimonial].role}</small>
                  </div>
                </div>
                <CheckCircle size={36} color="#4ade80" />
              </div>
              <div className="d-flex gap-3 mt-4 justify-content-center">
                <button 
                  onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)} 
                  className="btn btn-light rounded-circle hover-scale" 
                  style={{ width: '45px', height: '45px' }}
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)} 
                  className="btn btn-light rounded-circle hover-scale" 
                  style={{ width: '45px', height: '45px' }}
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Appointment Section */}
      <section id="appointment" className="py-5 bg-light">
        <div className="container py-5">
          <div className="row align-items-center">
            <AnimatedSection className="col-lg-6 mb-4 mb-lg-0">
              <div className="bg-white p-4 rounded-4 shadow-lg">
                <span className="badge px-4 py-2 mb-3" style={{ backgroundColor: '#fff', color: '#009688', borderRadius: '20px', border: '2px solid #009688' }}>
                  Book Now
                </span>
                <h2 className="fw-bold mb-3 display-4" style={{ color: '#004d40' }}>Get Appointment</h2>
                <p className="text-muted mb-4">Fill out the form and we'll contact you shortly.</p>
                {bookingSubmitted ? (
                  <div className="alert alert-success border-0 shadow p-4" style={{ borderRadius: '20px' }}>
                    <div className="d-flex align-items-center mb-3">
                      <CheckCircle size={40} color="#28a745" className="me-3" />
                      <h4 className="alert-heading fw-bold mb-0">Appointment Booked!</h4>
                    </div>
                    <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                      <p className="mb-2"><strong>Booking ID:</strong> <span className="text-primary fw-bold">{bookingId}</span></p>
                      <p className="mb-2"><strong>Date:</strong> {formData.date}</p>
                      <p className="mb-2"><strong>Time:</strong> {formData.time}</p>
                      <p className="mb-0"><strong>Doctor:</strong> {formData.doctor}</p>
                    </div>
                    <p className="mb-3 small text-muted">Please save your Booking ID for reference. We will contact you shortly to confirm.</p>
                    <button 
                      onClick={generatePDF}
                      className="btn text-white w-100 py-2 btn-3d d-flex align-items-center justify-content-center gap-2" 
                      style={{ backgroundColor: '#009688', borderRadius: '20px' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      Download Appointment as PDF
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {[
                      { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Doe' },
                      { label: 'Email', name: 'email', type: 'email', placeholder: 'john@example.com' },
                      { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+1 234 567 8900' },
                      { label: 'Date', name: 'date', type: 'date', placeholder: '' }
                    ].map((field, i) => (
                      <div key={i} className="mb-3">
                        <label className="form-label fw-semibold">{field.label} *</label>
                        <input 
                          type={field.type} 
                          className="form-control py-2" 
                          placeholder={field.placeholder} 
                          name={field.name} 
                          value={formData[field.name]} 
                          onChange={handleInputChange} 
                          required 
                          min={field.name === 'date' ? today : undefined}
                          style={{ borderRadius: '12px' }} 
                        />
                      </div>
                    ))}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Select Doctor *</label>
                      <select 
                        className="form-select py-2" 
                        name="doctor" 
                        value={formData.doctor} 
                        onChange={handleInputChange} 
                        required 
                        style={{ borderRadius: '12px' }}
                      >
                        <option value="">Choose a doctor</option>
                        {doctors.map((doc, i) => (
                          <option key={i} value={doc.name}>{doc.name} - {doc.specialty}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Select Time *</label>
                      <select 
                        className="form-select py-2" 
                        name="time" 
                        value={formData.time} 
                        onChange={handleInputChange} 
                        required 
                        disabled={!formData.date || !formData.doctor}
                        style={{ borderRadius: '12px' }}
                      >
                        <option value="">Choose a time</option>
                        {getAvailableTimes().map((time, i) => (
                          <option key={i} value={time}>{time}</option>
                        ))}
                      </select>
                      {formData.date && formData.doctor && getAvailableTimes().length === 0 && (
                        <small className="text-danger">No available times for this date and doctor. Please select another date.</small>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Service *</label>
                      <select 
                        className="form-select py-2" 
                        name="service" 
                        value={formData.service} 
                        onChange={handleInputChange} 
                        required 
                        style={{ borderRadius: '12px' }}
                      >
                        <option value="">Choose a service</option>
                        <option value="eye-checkup">Eye Checkup</option>
                        <option value="vision-consultation">Vision Consultation</option>
                        <option value="surgical">Surgical Procedures</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Message</label>
                      <textarea 
                        className="form-control py-2" 
                        rows="3" 
                        placeholder="Any questions?" 
                        name="message" 
                        value={formData.message} 
                        onChange={handleInputChange} 
                        style={{ borderRadius: '12px' }}
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="btn text-white w-100 py-3 btn-3d" 
                      style={{ backgroundColor: '#009688', borderRadius: '20px' }}
                      disabled={!formData.date || !formData.doctor || !formData.time || getAvailableTimes().length === 0}
                    >
                      Book Appointment
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>
            <AnimatedSection className="col-lg-6">
              <div className="img-zoom rounded-4 overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=700&h=600&fit=crop" 
                  alt="Appointment scheduling" 
                  className="img-fluid" 
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light">
        <div className="container py-5">
          <div className="row align-items-center">
            <AnimatedSection className="col-lg-6 mb-4 mb-lg-0">
              <div className="img-zoom rounded-4 overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=700&h=600&fit=crop" alt="Eye care clinic team" className="img-fluid" />
              </div>
            </AnimatedSection>
            <AnimatedSection className="col-lg-6">
              <span className="badge px-4 py-2 mb-3" style={{ backgroundColor: '#fff', color: '#009688', borderRadius: '20px' }}>
                About Us
              </span>
              <h2 className="fw-bold mb-4 display-4" style={{ color: '#004d40' }}>Caring For Your Eye Health</h2>
              <p className="text-muted mb-4 fs-5">
                Since 1990, providing exceptional eye care with experienced ophthalmologists and advanced technology.
              </p>
              <div className="row g-3 mb-4">
                {[
                  { icon: <Award size={36} />, title: 'Advanced Equipment', desc: 'State-of-the-art tools', color: '#f8f9fa' },
                  { icon: <User size={36} />, title: 'Qualified Doctors', desc: 'Board-certified specialists', color: '#f8f9fa' }
                ].map((f, i) => (
                  <div key={i} className="col-md-6">
                    <div className="d-flex align-items-start p-3 rounded-3 hover-lift" style={{ backgroundColor: f.color, cursor: 'pointer' }}>
                      <div className="rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px', backgroundColor: '#fff', color: '#009688' }}>
                        {f.icon}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">{f.title}</h6>
                        <p className="text-muted mb-0 small">{f.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Section with Slider */}
      <section id="services" className="py-5">
        <div className="container py-5">
          <AnimatedSection className="text-center mb-5">
            <span className="badge px-4 py-2 mb-3" style={{ backgroundColor: '#fff', color: '#009688', borderRadius: '20px' }}>
              Our Services
            </span>
            <h2 className="fw-bold display-3" style={{ color: '#004d40' }}>Eye Care Services</h2>
          </AnimatedSection>
          
          <div className="d-none d-lg-block">
            <SectionSlider 
              items={services}
              renderItem={(s, i) => (
                <div id={`service-${s.id}`} className="card border-0 shadow hover-lift h-100" style={{ borderRadius: '20px', cursor: 'pointer' }}>
                  <div className="img-zoom" style={{ height: '200px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                    <img src={s.img} alt={s.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="card-body text-center p-4" style={{ backgroundColor: s.color }}>
                    <div className="mb-3 d-inline-flex p-3 rounded-circle hover-scale" style={{ backgroundColor: '#fff', color: '#009688', cursor: 'pointer' }}>
                      {s.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{s.title}</h5>
                    <p className="text-muted mb-3">{s.desc}</p>
                    <button 
                      onClick={() => { setSelectedService(s); setShowServiceModal(true); }} 
                      className="btn text-white px-4 py-2 btn-3d" 
                      style={{ backgroundColor: '#009688', borderRadius: '20px' }}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              )}
            />
          </div>

          <div className="row g-4 d-lg-none">
            {services.map((s, i) => (
              <div key={i} className="col-md-6">
                <div className="card border-0 shadow hover-lift h-100" style={{ borderRadius: '20px', cursor: 'pointer' }}>
                  <div className="img-zoom" style={{ height: '200px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                    <img src={s.img} alt={s.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="card-body text-center p-4" style={{ backgroundColor: s.color }}>
                    <div className="mb-3 d-inline-flex p-3 rounded-circle hover-scale" style={{ backgroundColor: '#fff', color: '#009688', cursor: 'pointer' }}>
                      {s.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{s.title}</h5>
                    <p className="text-muted mb-3">{s.desc}</p>
                    <button 
                      onClick={() => { setSelectedService(s); setShowServiceModal(true); }} 
                      className="btn text-white px-4 py-2 btn-3d" 
                      style={{ backgroundColor: '#009688', borderRadius: '20px' }}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-light">
        <div className="container py-5">
          <AnimatedSection className="text-center mb-5">
            <span className="badge px-4 py-2 mb-3" style={{ backgroundColor: '#fff', color: '#009688', borderRadius: '20px', border: '2px solid #009688' }}>
              Get In Touch
            </span>
            <h2 className="fw-bold display-3 mb-3" style={{ color: '#004d40' }}>Contact Us</h2>
            <p className="text-muted lead mb-0" style={{ maxWidth: '600px', margin: '0 auto' }}>We're here to answer your questions and schedule your appointment. Reach out through any of the channels below.</p>
          </AnimatedSection>
          
          <div className="row g-4 mb-5">
            <AnimatedSection className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-lg h-100 hover-lift" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="card-body text-center p-4" style={{ backgroundColor: '#fff' }}>
                  <div className="mb-3">
                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px', backgroundColor: '#e0f7f5', color: '#009688' }}>
                      <MapPin size={32} />
                    </div>
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#004d40' }}>Visit Our Clinic</h5>
                  <p className="text-muted mb-2">123 Eye Street, Vision City</p>
                  <p className="text-muted mb-3">VC 12345, United States</p>
                  <div className="mb-3 p-2 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                    <small className="text-muted d-block"><strong>Mon - Fri:</strong> 9:00 AM - 6:00 PM</small>
                    <small className="text-muted d-block"><strong>Sat:</strong> 10:00 AM - 4:00 PM</small>
                    <small className="text-muted d-block"><strong>Sun:</strong> Closed</small>
                  </div>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=123+Eye+Street%2C+Vision+City%2C+VC+12345" 
                    className="btn text-white w-100 btn-3d" 
                    style={{ backgroundColor: '#009688', borderRadius: '20px' }}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-lg h-100 hover-lift" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="card-body text-center p-4" style={{ backgroundColor: '#fff' }}>
                  <div className="mb-3">
                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px', backgroundColor: '#e0f7f5', color: '#009688' }}>
                      <Phone size={32} />
                    </div>
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#004d40' }}>Call Us</h5>
                  <p className="text-muted mb-2">Have a question? Call us directly</p>
                  <a href="tel:+12345678900" className="text-decoration-none">
                    <h4 className="fw-bold mb-2" style={{ color: '#009688' }}>+1 (234) 567-8900</h4>
                  </a>
                  <div className="mb-3 p-2 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                    <small className="text-muted d-block"><strong>Emergency Line:</strong></small>
                    <small className="fw-bold" style={{ color: '#009688' }}>+1 (234) 567-8911</small>
                    <small className="text-muted d-block mt-1">(24/7 Available)</small>
                  </div>
                  <a 
                    href="tel:+12345678900" 
                    className="btn text-white w-100 btn-3d" 
                    style={{ backgroundColor: '#009688', borderRadius: '20px' }}
                  >
                    Call Now
                  </a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection className="col-lg-4 col-md-6 mx-auto">
              <div className="card border-0 shadow-lg h-100 hover-lift" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="card-body text-center p-4" style={{ backgroundColor: '#fff' }}>
                  <div className="mb-3">
                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px', backgroundColor: '#e0f7f5', color: '#009688' }}>
                      <Mail size={32} />
                    </div>
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#004d40' }}>Email Us</h5>
                  <p className="text-muted mb-2">Send us your inquiries anytime</p>
                  <a href="mailto:info@eyecare.com" className="text-decoration-none">
                    <p className="fw-semibold mb-2" style={{ color: '#009688', fontSize: '1.1rem' }}>info@eyecare.com</p>
                  </a>
                  <div className="mb-3 p-2 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                    <small className="text-muted d-block"><strong>Support:</strong></small>
                    <small className="text-muted">support@eyecare.com</small>
                    <small className="text-muted d-block mt-1"><strong>Appointments:</strong></small>
                    <small className="text-muted">appointments@eyecare.com</small>
                  </div>
                  <a 
                    href="mailto:info@eyecare.com" 
                    className="btn text-white w-100 btn-3d" 
                    style={{ backgroundColor: '#009688', borderRadius: '20px' }}
                  >
                    Send Email
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection>
            <div className="map-container" style={{ height: '450px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.242160313!2d-73.98731968459202!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1635782345678!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="EyeCare Clinic Location"
              ></iframe>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5" style={{ background: 'linear-gradient(135deg, #004d40, #00695c)', color: 'white' }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="d-flex align-items-center mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop" 
                  alt="EyeCare Logo" 
                  className="me-2 rounded-circle" 
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                />
                <h4 className="fw-bold mb-0" style={{ color: '#fff' }}>EyeCare</h4>
              </div>
              <p className="text-white-50 mb-3">Providing exceptional eye care services with compassion and expertise since 1990.</p>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5 className="fw-bold mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                {[
                  { name: 'Home', icon: <ArrowRight size={14} /> },
                  { name: 'About', icon: <ArrowRight size={14} /> },
                  { name: 'Services', icon: <ArrowRight size={14} /> },
                  { name: 'Doctors', icon: <ArrowRight size={14} /> },
                  { name: 'Shop', icon: <ArrowRight size={14} /> },
                  { name: 'Contact', icon: <ArrowRight size={14} /> }
                ].map((item, i) => (
                  <li key={i} className="mb-2">
                    <a href={`#${item.name.toLowerCase()}`} className="text-white-50 text-decoration-none footer-link d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                      {item.icon}
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5 className="fw-bold mb-3">Services</h5>
              <ul className="list-unstyled">
                {footerServices.map((s, i) => (
                  <li key={i} className="mb-2">
                    <a href={`#service-${s.id}`} className="text-white-50 text-decoration-none footer-link d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                      <ArrowRight size={14} />
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5 className="fw-bold mb-3">Account</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/login" className="text-white-50 text-decoration-none footer-link">Sign In</Link></li>
                <li className="mb-2"><Link to="/register" className="text-white-50 text-decoration-none footer-link">Create Account</Link></li>
                <li className="mb-2"><Link to="/admin/login" className="text-white-50 text-decoration-none footer-link">Admin Login</Link></li>
                <li className="mb-2"><a href="#booking" className="text-white-50 text-decoration-none footer-link">Book Appointment</a></li>
              </ul>
            </div>
            <div className="col-lg-2">
              <h5 className="fw-bold mb-3">Newsletter</h5>
              <p className="text-white-50 mb-3 small">Subscribe for eye health tips and updates.</p>
              <form onSubmit={handleNewsletterSubscribe}>
                <div className="input-group" style={{ borderRadius: '25px', overflow: 'hidden' }}>
                  <input type="email" className="form-control py-2" placeholder="Your email" required style={{ border: 'none' }} />
                  <button type="submit" className="btn text-white px-4" style={{ backgroundColor: '#009688' }}>Subscribe</button>
                </div>
              </form>
            </div>
          </div>
          <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0 text-white-50">&copy; {new Date().getFullYear()} EyeCare. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <a href="#" className="text-white-50 me-3 text-decoration-none footer-link d-inline-flex align-items-center gap-1">
                <ArrowRight size={14} />
                <span>Privacy Policy</span>
              </a>
              <a href="#" className="text-white-50 text-decoration-none footer-link d-inline-flex align-items-center gap-1">
                <ArrowRight size={14} />
                <span>Terms of Service</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Modal */}
      {showCart && (
        <>
          <div className="modal-backdrop-custom" onClick={() => setShowCart(false)}></div>
          <div className="position-fixed top-50 start-50 translate-middle" style={{ zIndex: 10000, width: '90vw', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="bg-white rounded-4 shadow-lg p-4 position-relative">
              <button
                onClick={() => setShowCart(false)}
                className="btn rounded-circle hover-scale-close d-flex align-items-center justify-content-center position-absolute p-0"
                style={{ 
                  top: '10px', 
                  right: '10px', 
                  width: '40px', 
                  height: '40px', 
                  zIndex: 10001,
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #dee2e6',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  color: '#495057'
                }}
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0" style={{ color: '#004d40' }}>Shopping Cart</h4>
              </div>
              {cart.length === 0 ? (
                <p className="text-center text-muted">Your cart is empty.</p>
              ) : (
                <>
                  {cart.map((item, i) => (
                    <div key={i} className="d-flex align-items-center gap-3 p-3 border-bottom">
                      <img src={item.img} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{item.name}</h6>
                        <p className="mb-1 small text-muted">{item.price} x {item.quantity}</p>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button onClick={() => updateQuantity(item.name, item.quantity - 1)} className="btn btn-sm btn-outline-secondary" aria-label="Decrease quantity"><Minus size={16} /></button>
                        <span className="px-2 fw-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.name, item.quantity + 1)} className="btn btn-sm btn-outline-secondary" aria-label="Increase quantity"><Plus size={16} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.name)} className="btn btn-sm btn-outline-danger ms-2" aria-label="Remove item"><X size={16} /></button>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between align-items-center mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                    <h5 className="mb-0">Total: ${getCartTotal()}</h5>
                    <button onClick={() => { setShowCart(false); setShowCheckout(true); }} className="btn text-white px-4 py-2" style={{ backgroundColor: '#009688', borderRadius: '25px' }}>
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <>
          <div className="modal-backdrop-custom" onClick={() => setShowCheckout(false)}></div>
          <div className="position-fixed top-50 start-50 translate-middle" style={{ zIndex: 10000, width: '90vw', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="bg-white rounded-4 shadow-lg p-4 position-relative">
              <button
                onClick={() => setShowCheckout(false)}
                className="btn rounded-circle hover-scale-close d-flex align-items-center justify-content-center position-absolute p-0"
                style={{ 
                  top: '10px', 
                  right: '10px', 
                  width: '40px', 
                  height: '40px', 
                  zIndex: 10001,
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #dee2e6',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  color: '#495057'
                }}
                aria-label="Close checkout"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0" style={{ color: '#004d40' }}>Checkout</h4>
              </div>
              <form onSubmit={handleCheckoutSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input type="text" className="form-control" placeholder="John Doe" required style={{ borderRadius: '12px' }} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input type="email" className="form-control" placeholder="john@example.com" required style={{ borderRadius: '12px' }} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Card Details</label>
                  <input type="text" className="form-control mb-2" placeholder="Card Number" required style={{ borderRadius: '12px' }} />
                  <div className="row">
                    <div className="col-6">
                      <input type="text" className="form-control" placeholder="MM/YY" required style={{ borderRadius: '12px' }} />
                    </div>
                    <div className="col-6">
                      <input type="text" className="form-control" placeholder="CVV" required style={{ borderRadius: '12px' }} />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                  <h5 className="mb-0">Total: ${getCartTotal()}</h5>
                  <button type="submit" className="btn text-white px-4 py-2" style={{ backgroundColor: '#28a745', borderRadius: '25px' }}>
                    <CreditCard size={20} className="me-2" /> Pay Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Doctor Modal */}
      {showDoctorModal && selectedDoctor && (
        <>
          <div className="modal-backdrop-custom" onClick={() => setShowDoctorModal(false)}></div>
          <div className="position-fixed top-50 start-50 translate-middle" style={{ zIndex: 10000, width: '90vw', maxWidth: '600px' }}>
            <div className="bg-white rounded-4 shadow-lg overflow-hidden position-relative">
              <button
                onClick={() => setShowDoctorModal(false)}
                className="btn rounded-circle hover-scale-close d-flex align-items-center justify-content-center position-absolute p-0"
                style={{ 
                  top: '10px', 
                  right: '10px', 
                  width: '40px', 
                  height: '40px', 
                  zIndex: 10001,
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #dee2e6',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  color: '#495057'
                }}
                aria-label="Close doctor profile"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
              <div className="img-zoom" style={{ height: '300px' }}>
                <img src={selectedDoctor.img} alt={selectedDoctor.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
              </div>
              <div className="p-4">
                <h3 className="fw-bold mb-2" style={{ color: '#004d40' }}>{selectedDoctor.name}</h3>
                <p className="text-muted mb-1">{selectedDoctor.specialty}</p>
                <p className="text-muted mb-3 small">{selectedDoctor.exp} • {selectedDoctor.patients} patients</p>
                <p className="mb-3">{selectedDoctor.about}</p>
                <p className="text-muted small mb-0"><strong>Education:</strong> {selectedDoctor.education}</p>
                <button onClick={() => setShowDoctorModal(false)} className="btn text-white w-100 mt-3" style={{ backgroundColor: '#009688', borderRadius: '25px' }}>
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Service Modal */}
      {showServiceModal && selectedService && (
        <>
          <div className="modal-backdrop-custom" onClick={() => setShowServiceModal(false)}></div>
          <div className="position-fixed top-50 start-50 translate-middle" style={{ zIndex: 10000, width: '90vw', maxWidth: '600px' }}>
            <div className="bg-white rounded-4 shadow-lg overflow-hidden position-relative">
              <button
                onClick={() => setShowServiceModal(false)}
                className="btn rounded-circle hover-scale-close d-flex align-items-center justify-content-center position-absolute p-0"
                style={{ 
                  top: '10px', 
                  right: '10px', 
                  width: '40px', 
                  height: '40px', 
                  zIndex: 10001,
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #dee2e6',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  color: '#495057'
                }}
                aria-label="Close service details"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
              <div className="img-zoom" style={{ height: '250px' }}>
                <img src={selectedService.img} alt={selectedService.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
              </div>
              <div className="p-4">
                <div className="mb-3 d-inline-flex p-3 rounded-circle" style={{ backgroundColor: '#009688', color: '#fff' }}>
                  {selectedService.icon}
                </div>
                <h3 className="fw-bold mb-2" style={{ color: '#004d40' }}>{selectedService.title}</h3>
                <p className="text-muted mb-3">{selectedService.fullDesc}</p>
                <h6 className="fw-bold mb-2">Benefits:</h6>
                <ul className="list-unstyled">
                  {selectedService.benefits.map((benefit, i) => (
                    <li key={i} className="d-flex align-items-center mb-2">
                      <Check size={16} className="me-2 text-success" />
                      <span className="text-muted">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => setShowServiceModal(false)} className="btn text-white w-100 mt-3" style={{ backgroundColor: '#009688', borderRadius: '25px' }}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Product Modal */}
      {showProductModal && selectedProduct && (
        <>
          <div className="modal-backdrop-custom" onClick={() => setShowProductModal(false)}></div>
          <div className="position-fixed top-50 start-50 translate-middle" style={{ zIndex: 10000, width: '90vw', maxWidth: '500px' }}>
            <div className="bg-white rounded-4 shadow-lg p-4 position-relative">
              <button
                onClick={() => setShowProductModal(false)}
                className="btn rounded-circle hover-scale-close d-flex align-items-center justify-content-center position-absolute p-0"
                style={{ 
                  top: '10px', 
                  right: '10px', 
                  width: '40px', 
                  height: '40px', 
                  zIndex: 10001,
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #dee2e6',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  color: '#495057'
                }}
                aria-label="Close product details"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
              <div className="row">
                <div className="col-md-5">
                  <div className="img-zoom" style={{ height: '250px', borderRadius: '12px', overflow: 'hidden' }}>
                    <img src={selectedProduct.img} alt={selectedProduct.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                </div>
                <div className="col-md-7">
                  <h3 className="fw-bold mb-2" style={{ color: '#004d40' }}>{selectedProduct.name}</h3>
                  <div className="mb-3">
                    <span className="text-muted text-decoration-line-through me-2">{selectedProduct.oldPrice}</span>
                    <span className="fw-bold fs-3" style={{ color: '#009688' }}>{selectedProduct.price}</span>
                  </div>
                  <p className="text-muted mb-3">{selectedProduct.description}</p>
                  <h6 className="fw-bold mb-2">Features:</h6>
                  <ul className="list-unstyled mb-4">
                    {selectedProduct.features.map((feature, i) => (
                      <li key={i} className="d-flex align-items-center mb-1">
                        <Check size={16} className="me-2 text-success" />
                        <span className="text-muted small">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="d-flex gap-2">
                    <button onClick={() => { addToCart(selectedProduct); setShowProductModal(false); }} className="btn text-white flex-grow-1" style={{ backgroundColor: '#009688', borderRadius: '25px' }}>
                      Add to Cart
                    </button>
                    <button onClick={() => setShowProductModal(false)} className="btn btn-outline-secondary" style={{ borderRadius: '25px' }}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default EyeCareLanding;
