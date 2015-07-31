package engxml;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Map.Entry;
import java.util.Comparator;
import java.util.Properties;
import java.util.TreeMap;

public class S {
	static void save(Converter converter) throws Exception {
		// converter.reset();
		String[] ss = { 
				"we_re_having_dinner_now_can_you_phone_again_later",
				"you_can_turn_off_the_television", 
				"i_m_not_watching_it",
				"weather_is_nice_at_moment",
				"the_weather_is_nice_at_the_moment_it_s_not_raining",
				"where_are_the_children",
				"where_are_the_children",
				"they_re_playing_in_the_park",
				"can_you_phone_again_later",
				"we_re_having_dinner_now",
				"are_you_feeling_ok",
				"yes_i_m_fine_thank_you",
				"is_it_raining_yes_take_an_umbrella",
				"why_are_you_wearing_a_coat",
				"it_s_not_cold",
				"what_s_paul_doing_he_s_reading_the_newspaper",
				"what_are_the_children_doing",
				"look_there_s_sally",
				"where_s_she_going",
				"is_paul_working_today",
				"are_your_friends_staying_at_a_hotel",
				"no_they_aren_t_they_re_staying_with_me",
				"i_work_in_a_shop_my_brother_works_in_a_bank",
				"her_parents_live_in_scotland",
				"rains", "lot", "winter",
				"it_rains_a_lot_in_winter", "has", "shower",
				"john_has_a_shower_everyday",
				"the_shops_open_at_9_o_clock_and_close_at_5_30",
				"tim_works_very_hard_he_starts_at_7_30_and_finishes_at_8_o_clock_in_the_evening",
				"the_earth_goes_round_the_sun",
				"we_do_a_lot_of_different_things_in_our_free_time",
				"it_costs_a_lot_o_f_money_to_stay_at_luxury_hotels",
				"sue_always_arrives_at_work_early",
				"i_usually_go_to_work_by_car_but_sometimes_i_walk",
				"julia_never_eats_breakfast",
				"tom_lives_near_us_we_often_see_him"
		};

		
		
			
		converter.load();
		for (String s : ss)
			converter.save(s, false);
	}
	
	public static void main(String[] args) throws Exception {

		String s = "Tom lives near us. We o fte n see him";

		Converter converter = new Converter();
		save(converter);
		converter.perform(s, -1, false);
	}
}
