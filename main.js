// Scroll animations
const observer=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.animate-on-scroll').forEach(el=>observer.observe(el));
// Navbar scroll
const navbar=document.querySelector('.navbar');
if(navbar)window.addEventListener('scroll',()=>{navbar.classList.toggle('scrolled',window.scrollY>20)},{passive:true});
// Mobile hamburger
const hamburger=document.querySelector('.hamburger'),navLinks=document.querySelector('.nav-links');
if(hamburger&&navLinks){hamburger.addEventListener('click',()=>{hamburger.classList.toggle('active');navLinks.classList.toggle('open');document.body.style.overflow=navLinks.classList.contains('open')?'hidden':''});navLinks.querySelectorAll('a').forEach(a=>{a.addEventListener('click',()=>{hamburger.classList.remove('active');navLinks.classList.remove('open');document.body.style.overflow=''})})}
// Counter animation
document.querySelectorAll('[data-count]').forEach(el=>{const target=parseInt(el.dataset.count),suffix=el.dataset.suffix||'',prefix=el.dataset.prefix||'';const io=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){const d=1500,st=performance.now();function u(n){const p=Math.min((n-st)/d,1),e=1-Math.pow(1-p,3),c=Math.round(target*e);el.textContent=prefix+c.toLocaleString()+suffix;if(p<1)requestAnimationFrame(u)}requestAnimationFrame(u);io.disconnect()}},{threshold:.5});io.observe(el)});
