import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const tickets = [
  {
    category: "shipping",
    message: "My order #48213 was supposed to arrive 3 days ago and the tracking page hasn't updated since it left the warehouse. Where is it?",
    reply: "Sorry for the wait on order #48213 — I checked the carrier's tracking and it's sitting at a regional hub, one stop behind schedule. It's now moving again and should land within 2 business days. I've added a $5 credit to your account for the delay."
  },
  {
    category: "shipping",
    message: "It's been 10 days since I placed order 55901 and it still says 'processing'. Did something go wrong with it?",
    reply: "I looked into order 55901 and it was stuck in our fulfillment queue due to a stock recheck on one item. It's been released and shipped as of today, with tracking sent to your email. Thanks for your patience."
  },
  {
    category: "shipping",
    message: "The tracking for order #61042 says 'delivered' but I never received the package. Someone must have taken it.",
    reply: "That's frustrating, and I'm sorry it happened. I've filed a lost-package claim with the carrier for order #61042 and, since claims can take a few days, I've gone ahead and shipped a free replacement so you're not left waiting on the investigation."
  },
  {
    category: "shipping",
    message: "Can I change the shipping speed on order 39871 to express? It hasn't shipped yet.",
    reply: "Good news — order 39871 hasn't left the warehouse yet, so I upgraded it to express shipping at no extra charge. You should see updated tracking with a new delivery estimate within the hour."
  },
  {
    category: "shipping",
    message: "I selected 2-day shipping on order #70234 but the estimate now shows a full week. What happened?",
    reply: "I'm sorry about that — a carrier delay in your region pushed several 2-day shipments out this week, including order #70234. I've refunded the shipping fee and it's currently on track to arrive within 2 days from today."
  },
  {
    category: "shipping",
    message: "My package for order 12988 arrived crushed on one corner because of how it was boxed, is that normal?",
    reply: "It shouldn't arrive like that, and I'm sorry — that's on us for the packaging, not your fault. I've flagged it to our fulfillment team and I'm sending a replacement for order 12988 in a reinforced box, no need to return the damaged one."
  },
  {
    category: "returns",
    message: "I want to return the jacket from order #44201, it doesn't fit. What's the process?",
    reply: "No problem — I've started a return for the jacket on order #44201 and emailed you a prepaid return label. Once it's scanned by the carrier, your refund will process automatically within 3-5 business days, no need to wait for us to receive it first."
  },
  {
    category: "returns",
    message: "I sent back my order two weeks ago (order 30215) and still haven't gotten my refund. Is something wrong?",
    reply: "I checked and the return for order 30215 arrived at our warehouse but got stuck in the inspection queue longer than it should have. I've processed the refund manually just now — you'll see it on your original payment method within 3-5 business days."
  },
  {
    category: "returns",
    message: "Can I exchange the shoes from order #56710 for a bigger size instead of a refund?",
    reply: "Sure thing — I've set up a free exchange for order #56710: send back the current pair with the label I just emailed you, and the next size up is already reserved and will ship as soon as the return is scanned, so you won't have a gap without shoes."
  },
  {
    category: "returns",
    message: "The return window for order 29844 says it closed, but I only just opened the box today. Can you still take it back?",
    reply: "Since it's only a few days past the standard window and the item is unused, I've made an exception and opened a return for order 29844. The prepaid label is on its way to your inbox now."
  },
  {
    category: "returns",
    message: "I returned two items from order #61455 but only got refunded for one. Where's the rest?",
    reply: "Good catch — looking at order #61455, the warehouse scanned in one item and the second was logged separately, which delayed its refund. I've released it manually now; you'll see the remaining amount back on your card in 3-5 business days."
  },
  {
    category: "returns",
    message: "Do I have to pay for return shipping on order 18300? Nothing on the site made that clear.",
    reply: "No charge on your end — return shipping is free for defective or wrong items, and for standard returns we deduct a small $4.99 fee from the refund instead of asking you to pay upfront. For order 18300 I've generated the label; you'll see the refund breakdown once it's processed."
  },
  {
    category: "billing",
    message: "I was charged twice for order #52190, once for $84.50 and once for $84.50 again the next day. Please refund one.",
    reply: "I see the duplicate authorization on order #52190 — this happens occasionally when a payment retries after a temporary bank timeout. I've voided the second charge; it can take 2-3 business days to disappear from your statement depending on your bank."
  },
  {
    category: "billing",
    message: "My card was billed $19.99 but the order confirmation for #33012 clearly says $14.99. Why the difference?",
    reply: "You're right, and I'm sorry for the discrepancy on order #33012 — a promo discount didn't apply correctly at checkout on our end. I've refunded the $5 difference to your card; no action needed from you."
  },
  {
    category: "billing",
    message: "There's a charge on my statement from your company that I don't recognize, no order number given.",
    reply: "Let's track that down — could you share the last 4 digits of the card and the charge amount/date? In the meantime, I've noted your account for review; most unrecognized charges turn out to be a subscription renewal or a split shipment, and I'll confirm as soon as I can match it."
  },
  {
    category: "billing",
    message: "I canceled order 71099 within the hour like your policy says, but I was still charged. Can you fix this?",
    reply: "Confirmed — order 71099 was canceled in time, so that charge shouldn't have gone through. I've issued a full refund; it'll typically post back to your account within 2-3 business days."
  },
  {
    category: "billing",
    message: "Why was I charged sales tax on order #40876 when my state doesn't tax clothing?",
    reply: "Good catch — I checked order #40876 and the tax was applied using the wrong category for one item. I've refunded the tax amount, and I've flagged the item's tax classification to our team so this doesn't repeat on future orders."
  },
  {
    category: "billing",
    message: "My gift card balance didn't apply to order 25543, I was charged the full amount on my credit card instead.",
    reply: "Sorry about that — the gift card on order 25543 wasn't applied at checkout due to a glitch. I've credited the gift card amount back to your card and re-loaded the remaining balance onto the gift card, so nothing is lost either way."
  },
  {
    category: "account",
    message: "I can't log in, it keeps saying my password is wrong even after I reset it twice.",
    reply: "Sorry for the trouble — I've manually cleared the login lock on your account and sent a fresh reset link, which should work this time. If it still won't accept the new password, try it in a private/incognito window in case an old session is cached."
  },
  {
    category: "account",
    message: "I never got the password reset email, checked spam too. My account email is on file already.",
    reply: "I resent the reset email directly from our system rather than the automated queue, so it should land faster — please check spam once more in the next few minutes. If it still doesn't arrive, let me know and I'll verify your identity and reset it manually."
  },
  {
    category: "account",
    message: "Someone changed the email on my account and I can't get back in. This wasn't me.",
    reply: "This sounds like account takeover, so I've locked the account immediately and reverted the email change back to your original address. I've also sent a secure verification link there so you can set a new password and I'd recommend enabling 2FA once you're back in."
  },
  {
    category: "account",
    message: "I want to merge two accounts, I accidentally signed up twice with different emails.",
    reply: "I can merge those for you — I've moved the order history and saved addresses from the duplicate account into your primary one and deactivated the extra login. You can continue signing in with your original email going forward."
  },
  {
    category: "account",
    message: "My account got suspended and I don't know why. I haven't done anything unusual.",
    reply: "I checked your account and the suspension was triggered automatically after several failed card charges in a short window, which our fraud filter flags by default. I've verified the activity was legitimate and reinstated your account — you should have full access now."
  },
  {
    category: "account",
    message: "I'm not receiving any order confirmation or shipping emails anymore, did something break?",
    reply: "Looks like your email was marked as undeliverable after a past bounce, which paused all notifications. I've cleared that flag and confirmed your address is valid — you should start receiving emails again with your next order."
  },
  {
    category: "subscription",
    message: "Please cancel my monthly subscription, I don't want to be charged again next month.",
    reply: "Done — I've canceled your subscription effective at the end of the current billing period, so you'll keep access until then with no further charges after that. You'll get a confirmation email shortly."
  },
  {
    category: "subscription",
    message: "I was charged for my subscription renewal even though I canceled it last week.",
    reply: "I'm sorry about that — your cancellation request was received but didn't process before the renewal ran due to timing on our end. I've refunded this month's charge in full and confirmed the subscription is now canceled with no further billing."
  },
  {
    category: "subscription",
    message: "Can I pause my subscription for two months instead of canceling it completely?",
    reply: "Yes, I've paused your subscription for the next 2 billing cycles — you won't be charged during that time, and it will automatically resume afterward unless you tell us otherwise. Your saved preferences and history stay intact while paused."
  },
  {
    category: "subscription",
    message: "I want to downgrade from the annual plan to monthly, is that possible mid-cycle?",
    reply: "I've switched you to the monthly plan, effective once your current annual term ends so you keep the time you already paid for. You'll get a reminder email before the first monthly charge goes through."
  },
  {
    category: "subscription",
    message: "How do I add a second user seat to my team subscription?",
    reply: "I've added a second seat to your team subscription — it'll show up as a prorated line item on your next invoice for the remaining days in this cycle, then bill normally after that. An invite link has been sent to add your teammate."
  },
  {
    category: "subscription",
    message: "My free trial ended and I got charged, but I meant to cancel before it converted.",
    reply: "I understand — since the charge happened right at the trial boundary, I've refunded the first billing cycle in full and canceled the subscription so it won't renew again. No further charges will come through."
  },
  {
    category: "defect",
    message: "The blender I ordered (order #67210) stopped working after 3 uses, the motor just hums and doesn't spin.",
    reply: "That's a defective unit — sorry about that. I've sent a free replacement blender for order #67210 with expedited shipping, and included a prepaid label for the faulty one; there's no need to wait for us to receive it before the replacement ships."
  },
  {
    category: "defect",
    message: "One of the headphone earcups from order 41029 has a rattling sound, I think a wire came loose inside.",
    reply: "That's not something you should have to deal with — I've processed a replacement for order 41029, shipping out today, and refunded a small amount for the inconvenience since it's a known intermittent issue with that batch."
  },
  {
    category: "defect",
    message: "My order #58877 arrived with a stain already on the shirt, it wasn't from shipping damage, looks like a factory defect.",
    reply: "Thanks for flagging that — I've sent a replacement shirt for order #58877 in the same size, and you can keep or donate the stained one, no return needed."
  },
  {
    category: "defect",
    message: "The charger cable that came with order 22876 frays at the connector after only a week.",
    reply: "That shouldn't happen that fast — I've shipped a replacement cable for order 22876 free of charge and noted the defect for quality review, since a few other customers have reported the same issue with that batch."
  },
  {
    category: "defect",
    message: "The watch from order #33450 stopped keeping time correctly after two days, it's losing several minutes daily.",
    reply: "Sorry to hear that — a defect like that usually means a faulty movement, so I've issued a full replacement for order #33450 rather than a repair, shipping express so you're not without it for long."
  },
  {
    category: "defect",
    message: "The couch cushions from order 15662 flattened out completely within a month of normal use.",
    reply: "That's well outside what we'd expect from normal wear, so I've processed a replacement set of cushions for order 15662 under our defect policy, no charge, along with a prepaid label if you'd like to send the flattened ones back for review."
  },
  {
    category: "technical",
    message: "The checkout page keeps freezing on the payment step, I've tried three times and can't complete my order.",
    reply: "Sorry about that — this matches a known issue with the payment step on certain mobile browsers, which our team is patching. In the meantime, try completing checkout in a desktop browser or the app; I've also cleared any stuck cart sessions on your account."
  },
  {
    category: "technical",
    message: "I can't upload a profile picture, it just says 'upload failed' every time regardless of the image.",
    reply: "This looks like an image-size validation bug on our end for files over 5MB that doesn't show the real error message. Try compressing the photo below 5MB for now — I've reported the misleading error message to our engineering team to get it fixed properly."
  },
  {
    category: "technical",
    message: "The mobile app crashes every time I open the order history tab.",
    reply: "Thanks for reporting this — it's a known crash tied to accounts with a large number of past orders, and a fix is already in testing. In the meantime, viewing your order history on the website instead of the app should work without issue."
  },
  {
    category: "technical",
    message: "My saved address keeps disappearing from my account after I log out and back in.",
    reply: "That's a sync bug affecting saved addresses on some accounts after certain app updates. I've manually restored your saved address from our backend and reported the bug — re-adding it after logging out shouldn't be needed again once the fix ships."
  },
  {
    category: "technical",
    message: "The search bar on the site returns zero results for products I know you sell, like 'running shoes'.",
    reply: "That's a known indexing issue affecting search for a subset of categories today — the catalog itself is fine, just not showing in search results. I've flagged it as high priority; browsing the category page directly will show the products in the meantime."
  },
  {
    category: "technical",
    message: "I keep getting logged out automatically every few minutes on the website.",
    reply: "This is a session-timeout bug affecting some browsers after a recent update. Clearing your cookies for our site should stop it in the short term, and our engineering team is rolling out a permanent fix in the next release."
  },
  {
    category: "promo",
    message: "My discount code WELCOME10 says 'invalid' at checkout even though it's within the expiration date listed.",
    reply: "I checked and WELCOME10 is valid but restricted to first-time customers, which the checkout error doesn't explain clearly — sorry for the confusing message. Since it looks like this may be your first order, I've applied the 10% discount manually for you."
  },
  {
    category: "promo",
    message: "I forgot to apply my promo code SAVE20 before completing order #29011, can you add it after the fact?",
    reply: "No problem — I've applied SAVE20 retroactively to order #29011 and refunded the 20% difference to your original payment method. You'll see it reflected within a few business days."
  },
  {
    category: "promo",
    message: "The 'free shipping' banner code didn't remove the shipping fee on order 60122, I was charged $6.99 anyway.",
    reply: "Sorry about that — the free-shipping promo had a minimum order value that wasn't displayed clearly on the banner, and order 60122 fell just under it. I've refunded the $6.99 shipping charge as a one-time courtesy."
  },
  {
    category: "promo",
    message: "Can I combine two discount codes on one order? The checkout only lets me enter one field.",
    reply: "Only one code can be applied per order by design, since combining them isn't something our checkout supports today. If you let me know which two codes you had, I can apply whichever gives you the better discount manually."
  },
  {
    category: "promo",
    message: "I used a referral code from a friend but neither of us got the credit that was promised.",
    reply: "I checked and the referral credit didn't trigger because the order fell just under the qualifying amount — I've manually applied the credit to both your account and your friend's as a one-time exception."
  },
  {
    category: "promo",
    message: "The loyalty points I earned last month vanished from my account, I had over 500.",
    reply: "I found the issue — your points expired early due to a bug in how the expiration date was calculated for accounts created around your sign-up date. I've restored all 500+ points to your account and corrected the expiration going forward."
  },
  {
    category: "order-edit",
    message: "I typed the wrong apartment number on order #48870, can you correct it before it ships?",
    reply: "Caught it in time — I've updated the apartment number on order #48870 to what you provided. It hasn't shipped yet, so the corrected address will be used automatically."
  },
  {
    category: "order-edit",
    message: "Can I add another item to order 39120? It hasn't shipped yet and I forgot something.",
    reply: "Order 39120 hasn't left the warehouse yet, but our system can't add items to an existing order once it's placed — what I've done instead is start a second order with free shipping for the extra item so you're not charged twice for delivery."
  },
  {
    category: "order-edit",
    message: "I moved and need to change the delivery address on order #52987, it's set for my old place.",
    reply: "I've updated the shipping address on order #52987 to your new one. If it had already left the warehouse I'd need to redirect it with the carrier instead, but this one hasn't shipped yet, so the change applied cleanly."
  },
  {
    category: "order-edit",
    message: "I need to cancel just one item from order 61780, not the whole order.",
    reply: "I've removed that item from order 61780 and refunded its cost individually — the rest of the order is unaffected and will ship as originally scheduled."
  },
  {
    category: "warranty",
    message: "My laptop stand from order #20044 has a wobble that started after 6 months, is it covered under warranty?",
    reply: "Yes, that's covered — the product carries a 1-year warranty against structural defects. I've started a warranty claim for order #20044 and a replacement stand is on its way, no charge and no need to return the wobbly one."
  },
  {
    category: "warranty",
    message: "It's been 13 months since I bought my order 17765 and it just broke, is the warranty already expired?",
    reply: "The standard warranty on that item is 12 months, so it's just past coverage — however, since it's only slightly outside the window, I've made a one-time exception and are sending a replacement for order 17765 at no cost."
  },
  {
    category: "warranty",
    message: "How do I file a warranty claim for a gift someone gave me? I don't have the order number.",
    reply: "No order number needed for warranty claims — if you can share the item name/model and roughly when it was purchased, I can look up the manufacturer's warranty terms and file the claim on your behalf using the gift-giver's proof of purchase if needed."
  },
  {
    category: "warranty",
    message: "The warranty replacement you sent for order #44982 has the exact same defect as the original.",
    reply: "I'm sorry that happened again — rather than sending a third unit of the same batch, I've issued a full refund for order #44982 instead of another replacement, since two defective units suggests a broader batch issue."
  }
];

const now = Date.now();
const archive = tickets.map((t, i) => ({
  id: `seed-${String(i + 1).padStart(3, "0")}`,
  category: t.category,
  message: t.message,
  reply: t.reply,
  source: "seed",
  createdAt: new Date(now - (tickets.length - i) * 36 * 60 * 60 * 1000).toISOString()
}));

const outPath = join(__dirname, "archive.json");
writeFileSync(outPath, JSON.stringify(archive, null, 2));
console.log(`Wrote ${archive.length} seed tickets to ${outPath}`);
