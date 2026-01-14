# Settings Schema - Complete Input Type Reference

All 28+ input types for `settings_schema.json` with examples.

## Text Inputs

### text

Single-line text input:

```json
{
  "type": "text",
  "id": "store_name",
  "label": "Store Name",
  "default": "My Store",
  "placeholder": "Enter store name",
  "info": "This appears in the header"
}
```

### textarea

Multi-line text input:

```json
{
  "type": "textarea",
  "id": "footer_text",
  "label": "Footer Text",
  "default": "© 2025 My Store. All rights reserved.",
  "placeholder": "Enter footer text"
}
```

### html

HTML code editor:

```json
{
  "type": "html",
  "id": "custom_html",
  "label": "Custom HTML",
  "default": "<p>Welcome to our store!</p>",
  "info": "Add custom HTML code"
}
```

### richtext

WYSIWYG rich text editor:

```json
{
  "type": "richtext",
  "id": "announcement_content",
  "label": "Announcement Bar Content",
  "default": "<p>Free shipping on orders over $50!</p>"
}
```

## Numeric Inputs

### number

Numeric input field:

```json
{
  "type": "number",
  "id": "products_per_page",
  "label": "Products Per Page",
  "default": 12,
  "min": 1,
  "max": 100,
  "step": 1,
  "info": "Number of products to show per page"
}
```

### range

Slider input:

```json
{
  "type": "range",
  "id": "columns",
  "label": "Number of Columns",
  "min": 2,
  "max": 6,
  "step": 1,
  "default": 4,
  "unit": "columns",
  "info": "Adjust the grid layout"
}
```

**Common units:**
- `px` - Pixels
- `%` - Percentage
- `em` - Em units
- `rem` - Root em units
- Custom text (like "columns", "items")

## Boolean Inputs

### checkbox

Toggle checkbox:

```json
{
  "type": "checkbox",
  "id": "show_search",
  "label": "Show Search Bar",
  "default": true,
  "info": "Display search in header"
}
```

### boolean

Boolean setting (same as checkbox):

```json
{
  "type": "boolean",
  "id": "enable_feature",
  "label": "Enable Feature",
  "default": false
}
```

## Selection Inputs

### select

Dropdown menu:

```json
{
  "type": "select",
  "id": "layout_style",
  "label": "Layout Style",
  "options": [
    {
      "value": "boxed",
      "label": "Boxed"
    },
    {
      "value": "full-width",
      "label": "Full Width"
    },
    {
      "value": "wide",
      "label": "Wide"
    }
  ],
  "default": "full-width",
  "info": "Choose your layout style"
}
```

### radio

Radio button selection:

```json
{
  "type": "radio",
  "id": "text_alignment",
  "label": "Text Alignment",
  "options": [
    { "value": "left", "label": "Left" },
    { "value": "center", "label": "Center" },
    { "value": "right", "label": "Right" }
  ],
  "default": "center"
}
```

## Color Inputs

### color

Color picker:

```json
{
  "type": "color",
  "id": "primary_color",
  "label": "Primary Color",
  "default": "#000000",
  "info": "Main brand color"
}
```

### color_background

Color with gradient support:

```json
{
  "type": "color_background",
  "id": "section_background",
  "label": "Section Background",
  "default": "linear-gradient(#ffffff, #000000)"
}
```

**Supports:**
- Solid colors: `#ffffff`
- Linear gradients: `linear-gradient(#fff, #000)`
- Radial gradients
- With opacity

## Media Inputs

### image_picker

Image upload and selection:

```json
{
  "type": "image_picker",
  "id": "logo",
  "label": "Logo Image",
  "info": "Recommended size: 300x100px"
}
```

Access in Liquid:

```liquid
{% if settings.logo %}
  <img src="{{ settings.logo | img_url: '300x' }}" alt="{{ shop.name }}">
{% endif %}

{{ settings.logo.width }}
{{ settings.logo.height }}
{{ settings.logo.alt }}
{{ settings.logo.src }}
```

### media

Image or video picker:

```json
{
  "type": "media",
  "id": "hero_media",
  "label": "Hero Media",
  "accept": ["image", "video"],
  "info": "Upload image or video"
}
```

### video_url

Video URL input (YouTube, Vimeo):

```json
{
  "type": "video_url",
  "id": "promo_video",
  "label": "Promo Video",
  "accept": ["youtube", "vimeo"],
  "placeholder": "https://www.youtube.com/watch?v=...",
  "info": "YouTube or Vimeo URL"
}
```

Access in Liquid:

```liquid
{% if settings.promo_video %}
  {{ settings.promo_video.type }}  {# youtube or vimeo #}
  {{ settings.promo_video.id }}    {# Video ID #}
{% endif %}
```

## Typography Inputs

### font_picker

Google Fonts selector:

```json
{
  "type": "font_picker",
  "id": "heading_font",
  "label": "Heading Font",
  "default": "helvetica_n7",
  "info": "Font for headings"
}
```

**Font format:** `family_weight`
- `n4` - Normal 400
- `n7` - Bold 700
- `i4` - Italic 400

Access in Liquid:

```liquid
{{ settings.heading_font.family }}
{{ settings.heading_font.weight }}
{{ settings.heading_font.style }}

{# CSS font face #}
<style>
  {{ settings.heading_font | font_face }}

  h1, h2, h3 {
    font-family: {{ settings.heading_font.family }}, {{ settings.heading_font.fallback_families }};
    font-weight: {{ settings.heading_font.weight }};
    font-style: {{ settings.heading_font.style }};
  }
</style>
```

## Resource Pickers

### product

Product selector:

```json
{
  "type": "product",
  "id": "featured_product",
  "label": "Featured Product",
  "info": "Select a product to feature"
}
```

Access in Liquid:

```liquid
{% assign product = all_products[settings.featured_product] %}
{{ product.title }}
{{ product.price | money }}
```

### collection

Collection selector:

```json
{
  "type": "collection",
  "id": "featured_collection",
  "label": "Featured Collection",
  "info": "Select a collection to feature"
}
```

Access in Liquid:

```liquid
{% assign collection = collections[settings.featured_collection] %}
{{ collection.title }}
{% for product in collection.products limit: 4 %}
  {{ product.title }}
{% endfor %}
```

### page

Page selector:

```json
{
  "type": "page",
  "id": "about_page",
  "label": "About Page",
  "info": "Link to about page"
}
```

Access in Liquid:

```liquid
{% assign page = pages[settings.about_page] %}
<a href="{{ page.url }}">{{ page.title }}</a>
{{ page.content }}
```

### blog

Blog selector:

```json
{
  "type": "blog",
  "id": "main_blog",
  "label": "Main Blog",
  "info": "Select your primary blog"
}
```

Access in Liquid:

```liquid
{% assign blog = blogs[settings.main_blog] %}
{{ blog.title }}
{% for article in blog.articles limit: 3 %}
  {{ article.title }}
{% endfor %}
```

### article

Article (blog post) selector:

```json
{
  "type": "article",
  "id": "featured_article",
  "label": "Featured Article",
  "info": "Select an article to feature"
}
```

### link_list

Menu/navigation selector:

```json
{
  "type": "link_list",
  "id": "main_menu",
  "label": "Main Navigation",
  "default": "main-menu",
  "info": "Select menu for header"
}
```

Access in Liquid:

```liquid
{% assign menu = linklists[settings.main_menu] %}
{% for link in menu.links %}
  <a href="{{ link.url }}">{{ link.title }}</a>

  {% if link.links.size > 0 %}
    {# Nested links #}
    {% for child_link in link.links %}
      <a href="{{ child_link.url }}">{{ child_link.title }}</a>
    {% endfor %}
  {% endif %}
{% endfor %}
```

## URL Inputs

### url

URL input field:

```json
{
  "type": "url",
  "id": "twitter_url",
  "label": "Twitter URL",
  "placeholder": "https://twitter.com/username",
  "info": "Your Twitter profile URL"
}
```

## Date & Time Inputs

### date

Date picker:

```json
{
  "type": "date",
  "id": "sale_end_date",
  "label": "Sale End Date",
  "info": "When the sale ends"
}
```

Access in Liquid:

```liquid
{{ settings.sale_end_date | date: '%B %d, %Y' }}
```

## Organization Elements

### header

Visual separator with heading:

```json
{
  "type": "header",
  "content": "Color Scheme Settings",
  "info": "Configure your color palette"
}
```

Not a setting, just a visual divider in the settings panel.

### paragraph

Informational text block:

```json
{
  "type": "paragraph",
  "content": "These settings control the appearance of your product cards. Make sure to preview changes on different screen sizes."
}
```

## Advanced Inputs

### liquid

Liquid code editor:

```json
{
  "type": "liquid",
  "id": "custom_liquid",
  "label": "Custom Liquid Code",
  "info": "Add custom Liquid code"
}
```

### inline_richtext

Inline rich text (no `<p>` wrapper):

```json
{
  "type": "inline_richtext",
  "id": "banner_text",
  "label": "Banner Text",
  "default": "Welcome to <strong>our store</strong>!",
  "info": "Text without paragraph wrapper"
}
```

## Complete Example

Full settings schema with multiple sections:

```json
[
  {
    "name": "theme_info",
    "theme_name": "Professional Theme",
    "theme_version": "1.0.0",
    "theme_author": "Your Name",
    "theme_documentation_url": "https://docs.example.com",
    "theme_support_url": "https://support.example.com"
  },
  {
    "name": "Colors",
    "settings": [
      {
        "type": "header",
        "content": "Brand Colors"
      },
      {
        "type": "color",
        "id": "color_primary",
        "label": "Primary Brand Color",
        "default": "#2196F3"
      },
      {
        "type": "color",
        "id": "color_secondary",
        "label": "Secondary Color",
        "default": "#FFC107"
      },
      {
        "type": "header",
        "content": "Background Colors"
      },
      {
        "type": "color_background",
        "id": "color_body_bg",
        "label": "Body Background",
        "default": "#FFFFFF"
      },
      {
        "type": "color_background",
        "id": "color_header_bg",
        "label": "Header Background",
        "default": "linear-gradient(#FFFFFF, #F5F5F5)"
      }
    ]
  },
  {
    "name": "Typography",
    "settings": [
      {
        "type": "paragraph",
        "content": "Select fonts for your store. Changes preview in real-time."
      },
      {
        "type": "font_picker",
        "id": "type_header_font",
        "label": "Heading Font",
        "default": "helvetica_n7",
        "info": "Font for all headings"
      },
      {
        "type": "font_picker",
        "id": "type_body_font",
        "label": "Body Font",
        "default": "helvetica_n4",
        "info": "Font for body text"
      },
      {
        "type": "range",
        "id": "type_base_size",
        "label": "Base Font Size",
        "min": 12,
        "max": 24,
        "step": 1,
        "default": 16,
        "unit": "px"
      }
    ]
  },
  {
    "name": "Header",
    "settings": [
      {
        "type": "image_picker",
        "id": "logo",
        "label": "Logo Image"
      },
      {
        "type": "range",
        "id": "logo_width",
        "label": "Logo Width",
        "min": 50,
        "max": 300,
        "step": 10,
        "default": 150,
        "unit": "px"
      },
      {
        "type": "link_list",
        "id": "main_menu",
        "label": "Main Menu",
        "default": "main-menu"
      },
      {
        "type": "checkbox",
        "id": "header_sticky",
        "label": "Sticky Header",
        "default": true,
        "info": "Header stays visible while scrolling"
      },
      {
        "type": "select",
        "id": "header_style",
        "label": "Header Style",
        "options": [
          { "value": "minimal", "label": "Minimal" },
          { "value": "classic", "label": "Classic" },
          { "value": "centered", "label": "Centered" }
        ],
        "default": "classic"
      }
    ]
  },
  {
    "name": "Product Pages",
    "settings": [
      {
        "type": "checkbox",
        "id": "product_show_vendor",
        "label": "Show Vendor",
        "default": true
      },
      {
        "type": "checkbox",
        "id": "product_show_sku",
        "label": "Show SKU",
        "default": false
      },
      {
        "type": "select",
        "id": "product_image_size",
        "label": "Image Size",
        "options": [
          { "value": "small", "label": "Small" },
          { "value": "medium", "label": "Medium" },
          { "value": "large", "label": "Large" }
        ],
        "default": "medium"
      },
      {
        "type": "product",
        "id": "related_product",
        "label": "Related Product"
      }
    ]
  },
  {
    "name": "Social Media",
    "settings": [
      {
        "type": "header",
        "content": "Social Media Accounts"
      },
      {
        "type": "url",
        "id": "social_twitter",
        "label": "Twitter",
        "placeholder": "https://twitter.com/username"
      },
      {
        "type": "url",
        "id": "social_facebook",
        "label": "Facebook",
        "placeholder": "https://facebook.com/username"
      },
      {
        "type": "url",
        "id": "social_instagram",
        "label": "Instagram",
        "placeholder": "https://instagram.com/username"
      }
    ]
  }
]
```

## Best Practices

1. **Group related settings** into logical sections
2. **Provide clear labels and info text** for guidance
3. **Set sensible defaults** for all settings
4. **Use appropriate input types** for each setting
5. **Add placeholder text** for URL and text inputs
6. **Use headers and paragraphs** to organize complex sections
7. **Limit range values** to reasonable min/max
8. **Test in theme customizer** to ensure good UX
9. **Document dependencies** between settings
10. **Consider mobile experience** when choosing input types
