const EnhancedContactSection = () => {
  return (
    <section id="contact" className="py-20 px-5 text-center bg-[#f5f5f5]">
      <h2 className="text-4xl font-bold text-[#743852] mb-5">CONTACT</h2>
      <p className="text-xl max-w-2xl mx-auto mb-8">
        Ready to be part of the culinary revolution?
      </p>

      <div className="max-w-2xl mx-auto text-left text-lg space-y-3">
        <p>
          <strong>Address:</strong> Jl. Monkey Forest No.15, Ubud, Bali
        </p>
        <p>
          <strong>Phone:</strong> +62 819 43286395
        </p>
        <p>
          <strong>Email:</strong>{' '}
          <a
            href="mailto:info@odefoodhall.com"
            className="text-blue-600 hover:underline"
          >
            info@odefoodhall.com
          </a>
        </p>
        <p>
          <strong>WhatsApp:</strong>{' '}
          <a
            href="https://wa.me/6281943286395?text=Hello! I'd like to learn about ODE Food Hall"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Chat on WhatsApp
          </a>
        </p>
        <p>
          <strong>Instagram:</strong>{' '}
          <a
            href="https://instagram.com/odefoodhall"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            @odefoodhall
          </a>
        </p>
        <p>
          <strong>Hours:</strong> Daily 07:00 – 23:00
        </p>
      </div>

      <div className="mt-10 text-sm text-gray-600">
        <p>&copy; 2025 ODE Food Hall. All rights reserved.</p>
        <p>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>{' '}
          |{' '}
          <a href="#" className="hover:underline">
            Terms of Use
          </a>
        </p>
      </div>
    </section>
  );
};

export default EnhancedContactSection;
