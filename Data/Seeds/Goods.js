/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("Goods").del();
  await knex("Goods").insert([
    {
      id: 1,
      title: "Sports Injury Treatment (1 session, 60 minutes)",
      image_url:
        "https://img.grouponcdn.com/seocms/3t1XNTmW1iXLCazTmhPCNZzfYMGM/if-you-play-sports-you-can-benefit-from-sports-massage_jpg-600x390",
      description:
        "Targeted approach to treating sports or exertion-related strains. This massage treatment is particularly effective when used in conjunction with light movement exercises or physiotherapy. Most common strain areas include the neck, shoulder, lower back, and calve areas. This treatment is for 1 session (total of 60 minutes), which includes a 5-minute consultation to understand your body condition, a massage of targeted pain points, and light movement exercises. Do note that persons who have been assessed to have underlying conditions or are going through pregnancy may be rejected from this therapy session. An alternative treatment may be suggested instead. Do contact me via WhatsApp if you are unsure of your suitability!",
      goods_type: "Service",
      price: 70.0,
    },
    {
      id: 2,
      title: "General Wellness Massage (1 session, 90 minutes)",
      image_url:
        "https://www.massageprocedures.com/wp-content/uploads/2012/04/Tuina-Chinese-massage.png",
      description:
        "This massage is for anyone! Whether you're feeling great but want to become even better, or your energy and health has been on the down low but you can't quite define what the issue is - it's always nice to have someone to provide you with advice and assistance. In this session we will determine what some underlying issues you may have (if any), and how we can treat you with a general full body massage session. Do note that persons who have been assessed to have underlying conditions or are going through pregnancy may be rejected from this therapy session. An alternative treatment may be suggested instead. Do contact me via WhatsApp if you are unsure of your suitability!",
      goods_type: "Service",
      price: 100.0,
    },
    {
      id: 3,
      title: "Cupping Session (1 session, 20 minutes)",
      image_url:
        "https://radii-bucket.s3.us-west-1.amazonaws.com/images/articles/559fa6a9f2d3fada63d10ba51d674ae5.jpg",
      description:
        "Cupping is a form of therapy that uses heat and suction force to provide relief from pain, soreness, tightness in large muscle groups, and treat other internal illnesses or bodily imbalances. In this session, a small flame is used to heat a glass cup and create a temporary vacuum in the cup, which is then placed on the skin to create a suction force that draws the skin and body tissue outwards. This lifting effect, combined with a customised variety of other Traditional Chinese Medicine techniques, has been used over thousands of years to provide relief to patients all over the world. Do note that persons who have been assessed to have underlying conditions or are going through pregnancy may be rejected from this therapy session. An alternative treatment may be suggested instead. Do contact me via WhatsApp if you are unsure of your suitability!",
      goods_type: "Service",
      price: 40.0,
    },
    {
      id: 4,
      title: "Pediatric Tuina Session (1 session, 30 minutes)",
      image_url:
        "https://singaporemotherhood.com/articles/wp-content/uploads/2019/09/paediatric-tuina2-1024x683.jpeg",
      description:
        "This is a 30 minute pediatric tuina session that is aimed at improving overall health of your child. This is suitable for children of ages 0 to 8. Some examples of common conditions in children that can be treated using pediatric tuina include infant torticollis, fever, lack of appetite, stomach wind, night terrors.",
      goods_type: "Service",
      price: 40.0,
    },
    {
      id: 5,
      title: "Natural Ox Horn Guasha Tool (1 piece)",
      image_url: "https://i.ebayimg.com/images/g/IscAAOSwVbJglQDd/s-l500.jpg",
      description:
        "Gua sha is good for musculoskeletal problems, especially major ones like tightness in the shoulders, legs and back. It can also help alleviate tension headaches, migraines, neck pain or swelling in your body. (Please avoid this technique if you've had surgery in the last six weeks. People who are taking blood thinners or have clotting disorders aren't good candidates for gua sha!) Upon ordering this product, please await a confirmation SMS from me to make arrangements for the pick up of the item.",
      goods_type: "Product",
      price: 7.0,
    },
    {
      id: 6,
      title: "Lumbar Roll (1 set)",
      image_url: "https://m.media-amazon.com/images/I/71YDoUhA-dL.jpg",
      description:
        "Lumbar rolls are designed to sit in the inward curve of your lower back or neck to improve sitting posture. This can prevent and provide relief from back pain. Upon ordering this product, please await a confirmation SMS from me to make arrangements for the pick up of the item.",
      goods_type: "Product",
      price: 20.0,
    },
  ]);
};
