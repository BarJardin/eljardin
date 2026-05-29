-- 003_seed.sql
-- Datos iniciales para entorno de desarrollo

insert into public.site_settings (
  business_name,
  address_line_1,
  address_line_2,
  phone,
  maps_link,
  maps_embed_url
)
values (
  'Bar Restaurante El Jardin',
  'C. Fernando Diaz de Mendoza, 67',
  'Carabanchel, 28019 Madrid',
  '+34 646 75 00 31',
  'https://www.google.com/maps/dir/?api=1&destination=C.+Fernando+D%C3%ADaz+de+Mendoza+67,+Madrid',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12153.16797989534!2d-3.71305035!3d40.40238175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4227c9e0016ef7%3A0x1f716622b48a6585!2sBar%20Restaurante%20El%20Jard%C3%ADn!5e0!3m2!1ses!2ses!4v1779112530501!5m2!1ses!2ses'
)
on conflict do nothing;

insert into public.menu_cards (title, route_label, href, image_url, sort_order, is_active)
values
  ('Carta Original', '/ Original Menu', '/original-menu', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 1, true),
  ('Desayunos', '/ Breakfast', '/breakfast', 'https://images.unsplash.com/photo-1484723091739-30a097e8f929', 2, true),
  ('Bocadillos y Sandwiches', '/ Sandwiches & Baguettes', '/sandwiches-baguettes', 'https://images.unsplash.com/photo-1550317138-10000687a72b', 3, true),
  ('Menu del Dia', '/ Daily Menu', '/daily-menu', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0', 4, true)
on conflict do nothing;

insert into public.testimonials (quote, author, rating, sort_order, is_active)
values
  ('La atencion es maravillosa y muy cercana. Mencion especial al camarero Javi.', 'Salvador C.G.', 5, 1, true),
  ('El lugar perfecto para pasar un buen momento. El servicio nuevo ha mejorado el lugar.', 'Victoria Garcia', 4, 2, true),
  ('Terraza tranquila, cerveza fresquita y un camarero de 10.', 'Javier Zamorano', 5, 3, true)
on conflict do nothing;

insert into public.business_hours (day_label, hours_text, sort_order, is_active)
values
  ('Mar - Dom', '7:00 - 00:00', 1, true),
  ('Lunes', 'Cerrado', 2, true)
on conflict do nothing;
