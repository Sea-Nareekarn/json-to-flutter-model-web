export interface SamplePreset {
  id: string;
  name: string;
  nameTh: string;
  description: string;
  defaultClassName: string;
  json: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'ecommerce_order',
    name: 'E-Commerce Order',
    nameTh: 'คำสั่งซื้อสินค้า (E-Commerce)',
    description: 'มี nested objects, list ของสินค้า, ราคา float/int, วันที่ ISO8601 และ snake_case keys',
    defaultClassName: 'OrderResponse',
    json: JSON.stringify({
      order_id: "ORD-2026-9842",
      order_number: 104829,
      status: "COMPLETED",
      is_paid: true,
      total_amount: 1450.75,
      tax_rate: 0.07,
      created_at: "2026-08-30T14:25:00.000Z",
      customer: {
        customer_id: "CUST-5512",
        first_name: "Somchai",
        last_name: "Prasert",
        email: "somchai.p@example.com",
        phone_number: "+66812345678",
        shipping_address: {
          address_line1: "123 Sukhumvit Road",
          sub_district: "Khlong Toei",
          district: "Khlong Toei",
          province: "Bangkok",
          postal_code: "10110",
          country_code: "TH"
        }
      },
      items: [
        {
          item_id: "PROD-001",
          product_name: "Flutter Developer Mechanical Keyboard",
          quantity: 1,
          unit_price: 1200.0,
          discount_amount: 50.0,
          tags: ["electronics", "gadget", "keyboard"]
        },
        {
          item_id: "PROD-002",
          product_name: "SonarQube Clean Code Desk Mat",
          quantity: 2,
          unit_price: 150.375,
          discount_amount: 0.0,
          tags: ["accessory", "desk"]
        }
      ],
      payment_method: {
        gateway: "PROMPTPAY",
        transaction_ref: "TXN-998271615",
        verified_at: "2026-08-30T14:26:12.000Z"
      }
    }, null, 2),
  },
  {
    id: 'user_profile',
    name: 'User Profile & Permissions',
    nameTh: 'ข้อมูลผู้ใช้งาน & สิทธิ์',
    description: 'ทดสอบ null values, boolean flags, รายการ string และ profile data',
    defaultClassName: 'UserProfile',
    json: JSON.stringify({
      user_id: 4289,
      username: "nareekarn_dev",
      display_name: "Nareekarn S.",
      bio: "Senior Flutter & Cloud Architect",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      is_verified: true,
      reputation_score: 98.6,
      joined_date: "2024-01-15T08:00:00Z",
      last_login: null,
      roles: ["ADMIN", "DEVELOPER", "AUDITOR"],
      preferences: {
        theme_mode: "dark",
        enable_push_notifications: true,
        newsletter_subscribed: false,
        language: "th-TH"
      }
    }, null, 2),
  },
  {
    id: 'api_pagination',
    name: 'Paginated API Response',
    nameTh: 'API Response แบบมี Pagination',
    description: 'รูปแบบ API มาตรฐานที่มี data list พร้อม pagination metadata',
    defaultClassName: 'ArticleListResponse',
    json: JSON.stringify({
      success: true,
      status_code: 200,
      message: "Data retrieved successfully",
      meta: {
        current_page: 1,
        per_page: 10,
        total_items: 245,
        total_pages: 25,
        has_next_page: true
      },
      data: [
        {
          id: 101,
          slug: "mastering-flutter-sonarqube-compliance",
          title: "Mastering SonarQube Compliance in Flutter & Dart",
          summary: "A practical guide to passing all SonarQube quality gates in your Flutter apps.",
          view_count: 5320,
          like_count: 489,
          author: {
            id: 12,
            name: "Alex Dev",
            badge: "Expert"
          },
          published_at: "2026-08-28T10:00:00Z"
        }
      ]
    }, null, 2),
  },
  {
    id: 'reserved_keywords',
    name: 'Reserved Keywords & Edge Cases',
    nameTh: 'คำสงวน Dart & เคสพิเศษ (SonarQube Edge Cases)',
    description: 'ทดสอบชื่อ key เช่น default, final, class, switch, ตัวเลขนำหน้า, @type, _id',
    defaultClassName: 'KeywordTestModel',
    json: JSON.stringify({
      "@type": "AuditRecord",
      "_id": "rec_99812",
      "default": true,
      "final": false,
      "class": "SecurityAudit",
      "switch": "enabled",
      "return": 200,
      "case": "standard_pass",
      "break": "none",
      "123_number_key": "valid",
      "special-kebab-key": "kebab-value",
      "user.address.street": "123 Main St",
      "EMPTY_LIST": [],
      "NULL_PROPERTY": null
    }, null, 2),
  }
];
