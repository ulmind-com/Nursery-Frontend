# Fix Add to cart and Buy now

## What will change
- Make **Add to cart** work on the currently displayed preview products.
- Add the selected size, planter, colour, quantity, image, and displayed price to the cart, then open the cart panel immediately.
- Make **Buy now** add the same selected configuration without opening the cart panel, then take the shopper directly to checkout.
- Enable quantity controls for preview products so the selected quantity is respected.
- Remove the current inactive-button behavior and the “add this product in admin” message for these two actions.

## Safety boundary
- Preview items may be viewed in the cart and carried to checkout for design/testing.
- Final quote, Razorpay payment, and order creation will remain backend-authoritative. A preview-only product will not be presented as a successful paid order if the backend does not recognize it.
- Real products added through the admin panel will continue using their backend product IDs, stock, variants, prices, and checkout rules.

## Validation
- Test Add to cart on the current plant preview: the drawer opens and shows the selected product correctly.
- Test Buy now: checkout opens with the selected product present.
- Test size, planter, colour, and quantity updates in both flows.
- Verify desktop and mobile behavior with no browser errors.
