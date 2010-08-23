package unifyeclipse;

import org.eclipse.core.resources.IResource;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.Path;
import org.eclipse.jface.viewers.ISelection;
import org.eclipse.jface.wizard.WizardPage;
import org.eclipse.swt.SWT;
import org.eclipse.swt.events.ModifyEvent;
import org.eclipse.swt.events.ModifyListener;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Text;
import org.eclipse.ui.dialogs.ContainerSelectionDialog;

public class UnifyAndroidNewWizardPage extends WizardPage {

	private Text containerText;
	private Text newProjectName;

	public UnifyAndroidNewWizardPage(ISelection selection){
		super("wizardPage");
		setTitle("Unify Android Wizard");
		setDescription("This creates an android project with unify application in it.");
	}
	
	@Override
	public void createControl(Composite parent) {
		Composite container = new Composite(parent, SWT.NULL);
		GridLayout layout = new GridLayout();
		container.setLayout(layout);
		layout.numColumns = 3;
		layout.verticalSpacing = 9;
		Label label = new Label(container, SWT.NULL);
		label.setText("&Unify-Project:");

		containerText = new Text(container, SWT.BORDER | SWT.SINGLE);
		GridData gd = new GridData(GridData.FILL_HORIZONTAL);
		containerText.setLayoutData(gd);
		containerText.setEditable(false);
		containerText.addModifyListener(new ModifyListener() {
			public void modifyText(ModifyEvent e) {
				dialogChanged();
			}
		});

		Button button = new Button(container, SWT.PUSH);
		button.setText("Browse...");
		button.addSelectionListener(new SelectionAdapter() {
			public void widgetSelected(SelectionEvent e) {
				handleBrowse();
			}
		});
		label = new Label(container, SWT.NULL);
		label.setText("&Android-Projektname:");

		newProjectName = new Text(container, SWT.BORDER | SWT.SINGLE);
		gd = new GridData(GridData.FILL_HORIZONTAL);
		newProjectName.setLayoutData(gd);
		newProjectName.addModifyListener(new ModifyListener() {
			public void modifyText(ModifyEvent e) {
				dialogChanged();
			}
		});
		//initialize();
		dialogChanged();
		setControl(container);
	}
	
	private void handleBrowse() {
		ContainerSelectionDialog dialog = new ContainerSelectionDialog(
				getShell(), ResourcesPlugin.getWorkspace().getRoot(), false,
				"Select unify project");
		if (dialog.open() == ContainerSelectionDialog.OK) {
			Object[] result = dialog.getResult();
			if (result.length == 1) {
				containerText.setText(((Path) result[0]).toString());
			}
		}
	}
	
	/**
	 * Ensures that both text fields are set.
	 */

	private void dialogChanged() {
		IResource container = ResourcesPlugin.getWorkspace().getRoot()
				.findMember(new Path(getContainerName()));

		if (!ResourcesPlugin.getWorkspace().getRoot().getProject("unify").exists()) {
			updateStatus("Bitte Unify in den Workspace legen");
			return;
		}
		
		if (getContainerName().length() == 0) {
			updateStatus("Das Unify-Applikationsprojekt muss ausgewählt werden");
			return;
		}
		if (getContainerName().toLowerCase().equals("/unify")) {
			updateStatus("Das Projekt ist kein Unify-Applikationsprojekt");
			return;
		}
		if (container == null
				|| (container.getType() & (IResource.PROJECT | IResource.FOLDER)) == 0) {
			updateStatus("Das Unify-Projekt muss existieren");
			return;
		}
		if (!container.isAccessible()) {
			updateStatus("Auf das Unify-Projekt kann nicht zugegriffen werden");
			return;
		}
		if (getNewProjectName().length() == 0) {
			updateStatus("Dem neuen Projekt muss ein Projektname gegeben werden");
			return;
		}
		updateStatus(null);
	}

	private void updateStatus(String message) {
		setErrorMessage(message);
		setPageComplete(message == null);
	}
	
	public String getContainerName() {
		return containerText.getText();
	}

	public String getNewProjectName() {
		return newProjectName.getText();
	}
}
