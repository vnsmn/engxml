package engxml;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map.Entry;
import java.util.Properties;

public class Converter {
	private Properties properties = new Properties();
	private List<String> sortedList = new ArrayList<>();

	public Converter() {
	}

	public String[] perform(String s, int index, boolean isLoad)
			throws Exception {
		if (isLoad) {
			load();
		}

		String[] ss = new String[4];

		System.out.println("[0]");
		ss[0] = toNormal(s, true);
		System.out.println(ss[0]);
		System.out.println("[1]");
		ss[1] = transform(ss[0], false);
		System.out.println(ss[1]);

		System.out.println("[2]");
		ss[2] = toNormal(s, false);
		System.out.println(ss[2]);
		System.out.println("[3]");
		ss[3] = transform(ss[2], false);
		System.out.println(ss[3]);

		if (index > -1) {
			save(ss[index], true);
		}
		return ss;
	}

	public void load() throws Exception {
		sortedList.clear();
		File f = new File(System.getProperty("user.dir"), "db.dat");
		if (f.exists()) {
			properties.loadFromXML(new FileInputStream(f));
			for (Entry<Object, Object> ent : properties.entrySet()) {
				sortedList.add(ent.getKey().toString());
			}
		}
		Collections.sort(sortedList, new ComparatorExt());
		//System.out.println(sortedList);
	}

	public void reset() throws Exception {
		properties.clear();
		save("", true);
	}

	public void save(String s, boolean isSaveToFile)
			throws FileNotFoundException, IOException {
		String[] ss = s.split("_");
		int i = 0;
		String w = "";
		while (i < ss.length) {
			w = ss[i];
			if (w.isEmpty()) {
				i++;
				continue;
			}
			properties.put(w,
					"" + getWeight(properties.getProperty(w, "0"), w.length()));
			int j = i + 1;
			while (j < ss.length) {
				w += "_" + ss[j];
				properties.put(
						w,
						""
								+ getWeight(properties.getProperty(w, "0"),
										w.length()));
				j++;
			}
			i++;
		}
		if (isSaveToFile) {
			File f = new File(System.getProperty("user.dir"), "db.dat");
			properties.storeToXML(new FileOutputStream(f), "", "utf-8");
		}
		sortedList.clear();
		for (Entry<Object, Object> ent : properties.entrySet()) {
			sortedList.add(ent.getKey().toString());
		}
		Collections.sort(sortedList, new ComparatorExt());
		//System.out.println(sortedList);
	}

	private int getWeight(String s, int increment) {
		if (s != null && !s.trim().isEmpty()) {
			int i = Integer.parseInt(s);
			return i + increment;
		} else {
			return increment;
		}
	}

	private String transform(String s, boolean isConvert) {
		if (s == null || s.trim().isEmpty()) {
			return "";
		}
		s = s.startsWith("_") ? s.substring(1) : s;
		s = s.endsWith("_") ? s.substring(0, s.length() - 1) : s;
		// System.out.println("-----" + s);
		String sentence = s;
		boolean isFound = false;
		for (String ent : sortedList) {
			String key = isConvert ? ent.replaceAll("_", "") : ent;
			int startPos = s.indexOf(key);
			if (startPos != -1) {
				int endPos = startPos + key.length();
				String center = ent;
				String left = transform(s.substring(0, startPos), false);
				String right = transform(s.substring(endPos, s.length()), false);
				sentence = left + "_" + center + "_" + right;
				isFound = true;
				break;
			}
		}
		return !isFound && !isConvert ? transform(s, true) : toNormal(sentence,
				true);
	}

	private String toNormal(String s, boolean isSpace) {
		s = s.trim().replaceAll("[ ]+", " ").toLowerCase();
		s = isSpace ? s.replaceAll("[ ]{1}", "_") : s.replaceAll("[ ]{1}", "");
		s = s.replaceAll("['‘.’,?]+", "_");
		s = s.replaceAll("[_]+", "_");
		s = s.toLowerCase();
		if (s.startsWith("_"))
			s = s.substring(1);
		if (s.endsWith("_"))
			s = s.substring(0, s.length() - 1);
		return s;
	}

	class ComparatorExt implements Comparator<String> {
		@Override
		public int compare(String s1, String s2) {
			int w1 = getWeight(properties.getProperty(s1), 0);
			int w2 = getWeight(properties.getProperty(s2), 0);
			int c = Integer.compare(s2.length(), s1.length());
			return c == 0 ? Integer.compare(w2, w1) : c;
		}
	}
}
